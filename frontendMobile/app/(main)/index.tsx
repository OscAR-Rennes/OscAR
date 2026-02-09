import React, { useRef } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { theme } from '../../constants/theme';
import '../../utils/ignoreWarnings';
import { GooglePlacesAutocomplete, GooglePlaceData, GooglePlaceDetail } from 'react-native-google-places-autocomplete';
import Constants from 'expo-constants';
const GOOGLE_API_KEY = Constants.expoConfig?.extra?.googleApiKey || '';
import PageTitle from '../../components/page-title';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageProvider } from '../../context/LanguageContext';

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

    return (
        <LanguageProvider>
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: theme.COLORS.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1, paddingHorizontal: theme.SPACING.large }}>
                        {/* Language Buttons */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: '#ffffff', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#cccccc' }}>
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
                        
                        {/* Header and Title */}
                        <PageTitle title={texts.title} />

                        {/* Map View */}
                        <View style={{ height: 400, borderWidth: 3, borderColor: '#000000', borderRadius: 8, overflow: 'hidden', }} >
                            <MapView ref={mapRef} style={{ height: '100%', width: '100%' }} initialRegion={{ latitude: 48.8566, longitude: 2.3522, latitudeDelta: 0.0922, longitudeDelta: 0.0421, }} >
                                {/* Example Marker */}
                                <Marker coordinate={{ latitude: 48.8566, longitude: 2.3522 }} title={"Paris"} description={"La capitale de la France"} />
                            </MapView>
                        </View>

                        {/* Search Bar */}
                        <View style={{ position: 'absolute', top: 185, left: 35, width: '93%', }} >
                            <GooglePlacesAutocomplete
                                placeholder={texts.searchPlaceholder}
                                onPress={handleLocationSelect}
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
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </LanguageProvider>
    );
}

// Traductions des textes statiques
const STATIC_TEXTS = {
    fr: {
        title: 'Carte de France',
        searchPlaceholder: 'Recherchez une adresse',
    },
    en: {
        title: 'Map of France',
        searchPlaceholder: 'Search for an address',
    },
};