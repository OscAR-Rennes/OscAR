import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { theme } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { SvgUri } from 'react-native-svg';
import culturalCentersData from '../../assets/data.json';
import '../../utils/ignoreWarnings';
import CulturalCenterModal from '../../components/cultural-center-modal';
import LanguageButton from '../../components/language-button';
import mapInitialValues from '../../constants/map-initial-values.json';
import { Address } from '../../common/dto/IAddress';
import { CulturalCenter } from '../../common/dto/ICulturalCenter';
import { CulturalCenterLight } from '../../common/dto/ICulturalCenterLight'
import { getIconUri } from '../icon-mapping';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import { getActiveCulturalCenter } from '../../api/services/culturalcenter.api'

export default function MapsScreen() {
    const { language, setLanguage } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const mapRef = useRef<MapView | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredCenters, setFilteredCenters] = useState<CulturalCenter[]>([]);
    const [isFlatListVisible, setFlatListVisible] = useState<boolean>(false);
    
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedCenter, setSelectedCenter] = useState<CulturalCenterLight | null>(null);

    const [lightCulturalCenterData, setLightCultutalCenterData] = useState<CulturalCenterLight[]>([])

    const culturalCenters: CulturalCenter[] = culturalCentersData.cultural_centers;
    const addresses: Address[] = culturalCentersData.address;

    useEffect(() => {
        const fetchData = async () => {
            const culturalCentersData = await getActiveCulturalCenter();
            setLightCultutalCenterData(culturalCentersData)
        };
        fetchData()
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            const culturalCenterData = await
        }

        if (selectedCenter && selectedCenter.id) {
            fetchData
        }
    }, [selectedCenter])

    // Handle search input changes
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim().length < 2) {
            setFilteredCenters([]);
            setFlatListVisible(false);
            return;
        }
        const results = culturalCenters.filter(center =>
            center.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCenters(results);
        setFlatListVisible(true);
    };

    // Handle cultural center selection from the list
    const handleCenterSelect = (center: CulturalCenterLight) => {
        if (mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: Number(center.address.latitude),
                longitude: Number(center.address.longitude),
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
                        <MapView ref={mapRef} style={{ flex: 1 }} initialRegion={mapInitialValues.initialRegion} >
                            { lightCulturalCenterData.length > 0 && lightCulturalCenterData.map(center => {
                                return (
                                    <Marker
                                        key={center.id}
                                        coordinate={{ latitude: Number(center.address.latitude), longitude: Number(center.address.longitude) }}
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
                                culturalCenterImage={selectedCenter.picture_path}
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
