import React, { useRef, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { theme } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import { SvgUri } from 'react-native-svg';
import culturalCentersData from '../../assets/data.json';
import { Asset } from 'expo-asset';
import '../../utils/ignoreWarnings';
import CulturalCenterModal from '../../components/cultural-center-modal';
import LanguageButton from '../../components/language-button';
import mapInitialValues from '../../constants/map-initial-values.json';

// Icon mapping
const ICONS = {
    "globe.svg": require('../../assets/icon/globe.svg'),
} as const;

// Define the type for the keys of ICONS
type IconName = keyof typeof ICONS;

// Function to get the URI of the SVG icon
function getIconUri(iconName: IconName): string {
    const iconSource = ICONS[iconName];
    if (!iconSource) {
        console.error(`Icon "${iconName}" not found in ICONS mapping.`);
        return '';
    }
    return Asset.fromModule(iconSource).uri || '';
}

// Define types for addresses
interface Address {
    id: string;
    zip: string;
    city: string;
    longitude: number;
    latitude: number;
    street: string;
    street_number: number;
}

// Define types for cultural centers
interface CulturalCenter {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    address_id: string;
    picture_path: string;
    created_at: string;
    updated_at: string;
}

export default function MapsScreen() {
    const { language, setLanguage } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const mapRef = useRef<MapView | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredCenters, setFilteredCenters] = useState<CulturalCenter[]>([]);
    const [isFlatListVisible, setFlatListVisible] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedCenter, setSelectedCenter] = useState<CulturalCenter | null>(null);

    const culturalCenters: CulturalCenter[] = culturalCentersData.cultural_centers;
    const addresses: Address[] = culturalCentersData.address;

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

    const handleCenterSelect = (center: CulturalCenter) => {
        const address = addresses.find(addr => addr.id === center.address_id);
        if (address && mapRef.current) {
            mapRef.current.animateToRegion({
                latitude: address.latitude,
                longitude: address.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
        setSearchQuery('');
        setFilteredCenters([]);
        setFlatListVisible(false);

        // Show the modal and set the selected center
        setSelectedCenter(center);
        setModalVisible(true);
    };

    const handleDeepLTranslation = async (lang: 'fr' | 'en') => {
        try {
            setLanguage(lang);
        } catch (error) {
            console.error('Erreur lors de la traduction avec DeepL:', error);
        }
    };

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
                            <LanguageButton
                                languageCode="fr"
                                currentLanguage={language}
                                onPress={() => handleDeepLTranslation('fr')}
                                label="Français"
                                countryCode="FR"
                            />
                            <LanguageButton
                                languageCode="en"
                                currentLanguage={language}
                                onPress={() => handleDeepLTranslation('en')}
                                label="English"
                                countryCode="GB"
                            />
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
                            initialRegion={mapInitialValues.initialRegion}
                        >
                            {culturalCenters.map(center => {
                                const address = addresses.find(addr => addr.id === center.address_id);
                                if (!address) return null;
                                return (
                                    <Marker
                                        key={center.id}
                                        coordinate={{ latitude: address.latitude, longitude: address.longitude }}
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

import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';