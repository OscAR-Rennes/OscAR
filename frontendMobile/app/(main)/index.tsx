import React, { useRef } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { theme } from '../../constants/theme';
import '../../utils/ignoreWarnings';
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey || '';
import PageTitle from '../../components/page-title';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageProvider } from '../../context/LanguageContext';
import { Asset } from 'expo-asset';
import { SvgUri } from 'react-native-svg';
import culturalCenters from '../../assets/data.json';
import CulturalCenterModal from '../../components/cultural-center-modal';

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

interface CulturalCenter {
    name: string;
    image: string;
    description: string;
}

export default function MapsScreen() {
    const { language, setLanguage } = useLanguage();
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts

    const handleDeepLTranslation = async (lang: 'fr' | 'en') => {
        try {
            setLanguage(lang); // Set the language 
        } catch (error) {
            console.error('Erreur lors de la traduction avec DeepL:', error);
        }
    };

    const [selectedCenter, setSelectedCenter] = React.useState<CulturalCenter | null>(null);
    const [isModalVisible, setModalVisible] = React.useState(false);

    const mapRef = useRef<MapView | null>(null);

    const handleLocationSelect = (data: GooglePlaceData, details: GooglePlaceDetail | null) => {
        if (details && mapRef.current) {
            const { lat, lng } = details.geometry.location;
            mapRef.current.animateToRegion({
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
        }
    };

    const handleMarkerPress = (center: CulturalCenter) => {
        setSelectedCenter(center);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedCenter(null);
    };

    return (
        <LanguageProvider>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={[]}
                        renderItem={null}
                        ListHeaderComponent={
                            <View style={{ flex: 1, paddingHorizontal: theme.SPACING.large }}>
                                {/* Language Buttons */}
                                <View style={{ flexDirection: 'column', marginTop: 20, backgroundColor: '#ffffff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#cccccc' }}>
                                    <View style={{ marginBottom: theme.SPACING.medium, flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                        <SvgUri uri={getIconUri("globe.svg")} width={30} height={30} color={"#62B5DE"} />
                                        <Text style={{ fontSize: theme.FONT_SIZES.subtitle, fontWeight: '700' }}>{texts.languageSelection}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <TouchableWithoutFeedback onPress={() => handleDeepLTranslation('fr')}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: language === 'fr' ? '#FFEBEE' : '#FFFFFF', borderColor: language === 'fr' ? theme.COLORS.primary : '#CCCCCC', borderWidth: 1, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 15, marginHorizontal: 5, flex: 1 }}>
                                                <Text style={{ color: language === 'fr' ? theme.COLORS.primary : '#000000', fontWeight: 'bold', marginRight: 5 }}>FR</Text>
                                                <Text style={{ color: language === 'fr' ? theme.COLORS.primary : '#000000', fontWeight: 'bold', fontSize: theme.FONT_SIZES.subtitle }}>Français</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                        <TouchableWithoutFeedback onPress={() => handleDeepLTranslation('en')}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: language === 'en' ? '#FFEBEE' : '#FFFFFF', borderColor: language === 'en' ? theme.COLORS.primary : '#CCCCCC', borderWidth: 1, borderRadius: 12, paddingVertical: 15, paddingHorizontal: 15, marginHorizontal: 5, flex: 1 }}>
                                                <Text style={{ color: language === 'en' ? theme.COLORS.primary : '#000000', fontWeight: 'bold', marginRight: 5 }}>GB</Text>
                                                <Text style={{ color: language === 'en' ? theme.COLORS.primary : '#000000', fontWeight: 'bold', fontSize: theme.FONT_SIZES.subtitle }}>English</Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>

                                {/* Header and Title */}
                                <PageTitle title={texts.title} />

                                <View>
                                    {/* Map View */}
                                    <View style={{ height: 400, borderWidth: 3, borderColor: '#000000', borderRadius: 8, overflow: 'hidden', marginBottom: theme.SPACING.large }}>
                                        <MapView
                                            ref={mapRef}
                                            style={{ height: '100%', width: '100%' }}
                                            initialRegion={{
                                                latitude: 48.8566,
                                                longitude: 2.3522,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421,
                                            }}
                                        >
                                            {culturalCenters.cultural_centers.map((center) => {
                                                const address = culturalCenters.address.find(addr => addr.id === center.address_id);
                                                if (!address) return null;
                                                return (
                                                    <Marker
                                                        key={center.id}
                                                        coordinate={{ latitude: address.latitude, longitude: address.longitude }}
                                                        onPress={() => handleMarkerPress({
                                                            name: center.name,
                                                            image: center.picture_path,
                                                            description: center.description,
                                                        })}
                                                    />
                                                );
                                            })}
                                        </MapView>
                                    </View>

                                    {/* Search Bar */}
                                    <View style={{ position: 'absolute', top: '2.5%', left: '2.5%', width: '95%' }}>
                                        <GooglePlacesAutocomplete
                                            placeholder={texts.searchPlaceholder}
                                            onPress={(data, details) => {
                                                handleLocationSelect(data, details);
                                            }}
                                            fetchDetails={true}
                                            query={{
                                                key: GOOGLE_API_KEY,
                                                language: language,
                                            }}
                                            styles={{
                                                textInput: {
                                                    height: 40,
                                                    borderColor: theme.COLORS.border,
                                                    borderWidth: 1,
                                                    paddingHorizontal: theme.SPACING.medium,
                                                    backgroundColor: theme.COLORS.background,
                                                    color: theme.COLORS.textPrimary,
                                                },
                                            }}
                                            textInputProps={{
                                                placeholderTextColor: theme.COLORS.placeholder,
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        }
                    />
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>

            {/* Cultural Center Modal */}
            {selectedCenter && (
                <CulturalCenterModal
                    visible={isModalVisible}
                    culturalCenterName={selectedCenter.name}
                    culturalCenterImage={selectedCenter.image}
                    culturalCenterDescription={selectedCenter.description}
                    onClose={handleCloseModal}
                    onViewCenter={() => setModalVisible(false)}
                />
            )}
        </LanguageProvider>
    );
}

// Traductions des textes statiques
const STATIC_TEXTS = {
    fr: {
        languageSelection: 'Sélection de la langue',
        title: 'Carte du monde',
        searchPlaceholder: 'Recherchez une adresse',
    },
    en: {
        languageSelection: 'Language Selection',
        title: 'Map of the world',
        searchPlaceholder: 'Search for an address',
    },
};