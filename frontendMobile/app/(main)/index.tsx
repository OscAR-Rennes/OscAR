import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Marker, Region } from 'react-native-maps';
import MapView from 'react-native-map-clustering';
import * as Location from 'expo-location';
import { theme } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { SvgUri } from 'react-native-svg';
import '../../utils/ignoreWarnings';
import CulturalCenterModal from '../../components/cultural-center-modal';
import LanguageButton from '../../components/language-button';
import mapInitialValues from '../../constants/map-initial-values.json';
import { CulturalCenterLight } from '../../common/dto/ICulturalCenterLight'
import { getIconUri } from '../icon-mapping';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import { getActiveCulturalCenterMapByBounds } from '../../api/services/culturalcenter.api'

type MapBounds = {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
};

const BOUNDS_MARGIN_FACTOR = 0.4;
const FETCH_DEBOUNCE_MS = 500;
const ZOOM_THRESHOLD_FACTOR = 0.5; // Invalidate cache if zoom changes by >50%
const API_LIMIT = 150; // Reduced limit for better performance with optimized minimal DTOs
const MAX_CENTERS_IN_MEMORY = 400; // Clean up distant centers if exceed this

export default function MapsScreen() {
    const { language, setLanguage } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const mapRef = useRef<any>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredCenters, setFilteredCenters] = useState<CulturalCenterLight[]>([]);
    const [isFlatListVisible, setFlatListVisible] = useState<boolean>(false);
    
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedCenter, setSelectedCenter] = useState<CulturalCenterLight | null>(null);

    const [lightCulturalCenterData, setLightCultutalCenterData] = useState<CulturalCenterLight[]>([])
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const userCenteredRef = useRef<boolean>(false);
    const loadedBoundsRef = useRef<Set<string>>(new Set());
    const coveredBoundsRef = useRef<MapBounds[]>([]);
    const inFlightRef = useRef<boolean>(false);
    const lastZoomLevelRef = useRef<number | null>(null); // Track zoom level for cache invalidation
    const [mapRegion, setMapRegion] = useState<Region>(mapInitialValues.initialRegion as Region);

    const buildBoundsFromRegion = (region: Region): MapBounds => ({
        minLat: region.latitude - region.latitudeDelta / 2,
        maxLat: region.latitude + region.latitudeDelta / 2,
        minLng: region.longitude - region.longitudeDelta / 2,
        maxLng: region.longitude + region.longitudeDelta / 2,
    });

    const getBoundsKey = (bounds: MapBounds): string => {
        const round = (value: number) => value.toFixed(2);
        return `${round(bounds.minLat)}:${round(bounds.maxLat)}:${round(bounds.minLng)}:${round(bounds.maxLng)}`;
    };

    const getExpandedBounds = (bounds: MapBounds): MapBounds => {
        const latSpan = bounds.maxLat - bounds.minLat;
        const lngSpan = bounds.maxLng - bounds.minLng;

        return {
            minLat: bounds.minLat - latSpan * BOUNDS_MARGIN_FACTOR,
            maxLat: bounds.maxLat + latSpan * BOUNDS_MARGIN_FACTOR,
            minLng: bounds.minLng - lngSpan * BOUNDS_MARGIN_FACTOR,
            maxLng: bounds.maxLng + lngSpan * BOUNDS_MARGIN_FACTOR,
        };
    };

    const isBoundsCovered = (bounds: MapBounds): boolean => {
        return coveredBoundsRef.current.some((covered) => (
            bounds.minLat >= covered.minLat &&
            bounds.maxLat <= covered.maxLat &&
            bounds.minLng >= covered.minLng &&
            bounds.maxLng <= covered.maxLng
        ));
    };

    const shouldInvalidateCache = (currentZoomLevel: number): boolean => {
        if (lastZoomLevelRef.current === null) {
            lastZoomLevelRef.current = currentZoomLevel;
            return false;
        }

        // Calculate zoom change ratio: if zoom changes by >50%, invalidate cache
        const zoomRatio = currentZoomLevel / lastZoomLevelRef.current;
        const shouldInvalidate = zoomRatio < (1 - ZOOM_THRESHOLD_FACTOR) || zoomRatio > (1 + ZOOM_THRESHOLD_FACTOR);

        if (shouldInvalidate) {
            lastZoomLevelRef.current = currentZoomLevel;
            loadedBoundsRef.current.clear();
            coveredBoundsRef.current = [];
        } else {
            lastZoomLevelRef.current = currentZoomLevel;
        }

        return shouldInvalidate;
    };

    const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
        const dLat = lat2 - lat1;
        const dLng = lng2 - lng1;
        return Math.sqrt(dLat * dLat + dLng * dLng);
    };

    const cleanupDistantCenters = (centers: CulturalCenterLight[], mapCenter: Region): CulturalCenterLight[] => {
        if (centers.length <= MAX_CENTERS_IN_MEMORY) {
            return centers;
        }

        // Calculate distance for each center from map center
        const centersWithDistance = centers.map((center) => {
            const lat = center.latitude ?? center.address?.latitude ?? 0;
            const lng = center.longitude ?? center.address?.longitude ?? 0;
            const distance = calculateDistance(mapCenter.latitude, mapCenter.longitude, lat, lng);
            return { center, distance };
        });

        // Keep only closest centers
        return centersWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, MAX_CENTERS_IN_MEMORY)
            .map((item) => item.center);
    };

    const mergeCenters = (existing: CulturalCenterLight[], incoming: CulturalCenterLight[], mapCenter: Region) => {
        const merged = new Map(existing.map((center) => [center.id, center]));
        incoming.forEach((center) => {
            merged.set(center.id, center);
        });
        const merged_array = Array.from(merged.values());
        return cleanupDistantCenters(merged_array, mapCenter);
    };

    const loadCentersInBounds = async (bounds: MapBounds) => {
        if (inFlightRef.current) {
            return;
        }

        // Check if zoom level changed dramatically
        const currentZoomLevel = Math.max(bounds.maxLat - bounds.minLat, bounds.maxLng - bounds.minLng);
        shouldInvalidateCache(currentZoomLevel);

        if (isBoundsCovered(bounds)) {
            return;
        }

        const expandedBounds = getExpandedBounds(bounds);
        const boundsKey = getBoundsKey(expandedBounds);
        if (loadedBoundsRef.current.has(boundsKey)) {
            coveredBoundsRef.current.push(expandedBounds);
            return;
        }

        inFlightRef.current = true;
        try {
            const response = await getActiveCulturalCenterMapByBounds({
                ...expandedBounds,
                limit: API_LIMIT
            });
            const centers = response?.data ?? response ?? [];
            if (Array.isArray(centers)) {
                setLightCultutalCenterData((prev) => mergeCenters(prev, centers, mapRegion));
            }
            loadedBoundsRef.current.add(boundsKey);
            coveredBoundsRef.current.push(expandedBounds);
        } catch (error) {
            console.error('Error while loading map centers in bounds:', error);
        } finally {
            inFlightRef.current = false;
        }
    };

    const centerMapOnUserLocation = async () => {
        if (userCenteredRef.current) {
            return;
        }

        try {
            const permission = await Location.requestForegroundPermissionsAsync();
            if (permission.status !== 'granted') {
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });

            const region: Region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.18,
                longitudeDelta: 0.18,
            };

            userCenteredRef.current = true;
            setMapRegion(region);
            mapRef.current?.animateToRegion(region, 700);
            loadCentersInBounds(buildBoundsFromRegion(region));
        } catch (error) {
            console.error('Unable to get user location:', error);
        }
    };

    const getCenterCoordinates = (center: CulturalCenterLight) => {
        const latitude = center.latitude ?? center.address?.latitude;
        const longitude = center.longitude ?? center.address?.longitude;
        return { latitude: Number(latitude), longitude: Number(longitude) };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const initialRegion = mapInitialValues.initialRegion as Region;
                loadCentersInBounds(buildBoundsFromRegion(initialRegion));
                await centerMapOnUserLocation();
            } catch (error) {
                console.error('Error while loading cultural centers:', error);
                setLightCultutalCenterData([]);
            }
        };
        fetchData();

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [])

    const handleRegionChangeComplete = (region: Region) => {
        setMapRegion(region);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            loadCentersInBounds(buildBoundsFromRegion(region));
        }, FETCH_DEBOUNCE_MS);
    };

    // Handle search input changes
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setFilteredCenters([]);
            setFlatListVisible(false);
            return;
        }
        const results = lightCulturalCenterData.filter(center =>
            center.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCenters(results);
        setFlatListVisible(true);
    };

    // Handle cultural center selection from the list
    const handleCenterSelect = (center: CulturalCenterLight) => {
        if (mapRef.current) {
            const coordinates = getCenterCoordinates(center);
            mapRef.current.animateToRegion({
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
        setSearchQuery('');
        setFilteredCenters([]);
        setFlatListVisible(false);

        setSelectedCenter(center);
        setModalVisible(true);
    };

    // Handle language change using DeepL API (simulated here)
    const handleDeepLTranslation = async (lang: 'fr' | 'en') => {
        try {
            setLanguage(lang);
        } catch (error) {
            console.error('Erreur lors de la traduction avec DeepL:', error);
        }
    };

    // Dismiss FlatList when tapping outside
    const dismissFlatList = () => {
        setFlatListVisible(false);
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); dismissFlatList(); }}>
                <View style={{ flex: 1, paddingHorizontal: theme.SPACING.large }}>
                    
                    {/* Language Buttons */}
                    <View style={{ flexDirection: 'column', marginTop: 20, backgroundColor: '#ffffff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#cccccc' }}>
                        <View style={{ marginBottom: theme.SPACING.medium, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                            <SvgUri uri={getIconUri("globe.svg")} width={30} height={30} color={"#62B5DE"} />
                            <Text style={{ fontSize: theme.FONT_SIZES.subtitle, fontWeight: '700' }}>{texts.languageSelection}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <LanguageButton languageCode="fr" currentLanguage={language} onPress={() => handleDeepLTranslation('fr')} label="Français" countryCode="FR" />
                            <LanguageButton languageCode="en" currentLanguage={language} onPress={() => handleDeepLTranslation('en')} label="English" countryCode="GB" />
                        </View>
                    </View>

                    <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 3, borderColor: '#000', height: 420, marginTop: theme.SPACING.medium }}>
                        {/* Search Bar */}
                        <View style={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 1 }}>
                            <TextInput style={{ height: 40, borderColor: theme.COLORS.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: theme.SPACING.medium, backgroundColor: theme.COLORS.background, color: theme.COLORS.textPrimary, }} placeholder={texts.searchPlaceholder} placeholderTextColor={theme.COLORS.placeholder} value={searchQuery} onChangeText={handleSearch} onFocus={() => setFlatListVisible(true)} />
                            {isFlatListVisible && filteredCenters.length > 0 && (
                                <FlatList
                                    data={filteredCenters}
                                    style={{ maxHeight: 200, backgroundColor: '#ffffff', borderRadius: 8, marginTop: 5 }}
                                    keyExtractor={(item) => item.id}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity onPress={() => handleCenterSelect(item)} style={{ backgroundColor: '#ffffff', borderBottomWidth: 1, borderColor: '#eee' }}>
                                            <View style={{ padding: theme.SPACING.small, borderBottomWidth: 1, borderColor: '#eee' }}>
                                                <Text style={{ color: theme.COLORS.textPrimary }}>{item.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                        </View>

                        {/* Map View */}
                        <MapView
                            ref={mapRef}
                            style={{ flex: 1 }}
                            initialRegion={mapRegion}
                            onRegionChangeComplete={handleRegionChangeComplete}
                            showsUserLocation
                            clusterColor="#62B5DE"
                            renderCluster={(cluster: any) => {
                                const pointCount = cluster?.properties?.point_count ?? cluster?.pointCount ?? 0;
                                return (
                                    <Marker
                                        key={`cluster-${cluster?.clusterId ?? `${cluster?.geometry?.coordinates?.[0]}-${cluster?.geometry?.coordinates?.[1]}`}`}
                                        coordinate={{
                                            latitude: cluster.geometry.coordinates[1],
                                            longitude: cluster.geometry.coordinates[0],
                                        }}
                                        onPress={cluster?.onPress}
                                    >
                                        <View
                                            style={{
                                                width: 42,
                                                height: 42,
                                                borderRadius: 21,
                                                backgroundColor: '#62B5DE',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderWidth: 2,
                                                borderColor: '#ffffff',
                                            }}
                                        >
                                            <Text style={{ color: '#ffffff', fontWeight: '700' }}>{pointCount}</Text>
                                        </View>
                                    </Marker>
                                );
                            }}
                        >
                            { lightCulturalCenterData.length > 0 && lightCulturalCenterData.map(center => {
                                const coordinates = getCenterCoordinates(center);
                                return (
                                    <Marker
                                        key={center.id}
                                        coordinate={{ latitude: coordinates.latitude, longitude: coordinates.longitude }}
                                        onPress={() => {
                                            setModalVisible(true);
                                            setSelectedCenter(center);
                                        }}
                                    />
                                );
                            })}
                        </MapView>

                        {/* Cultural Center Modal */}
                        {selectedCenter && (
                            <CulturalCenterModal
                                visible={modalVisible}
                                culturalCenterName={selectedCenter.name}
                                culturalCenterDescription={selectedCenter.description}
                                culturalCenterImage={selectedCenter.picture_path ?? ""}
                                culturalCenterId={selectedCenter.id}
                                onClose={() => setModalVisible(false)}
                                onViewCenter={() => {
                                    setModalVisible(false);
                                }}
                            />
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.index,
    fr: translationsFr.index
};
