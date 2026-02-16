import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { theme, globalStyles } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const { language } = useLanguage(); // Retrieve current language
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts

    // Get URI from icon module
    function getIconUri(iconSource: number): string {
        return Asset.fromModule(iconSource).uri || '';
    }

    // Handle password reset
    const handleReset = async () => {
        if (!email) return;

        try {
            setLoading(true);

            router.push('/forgot-password-send');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient
                colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={[theme.CONTAINER_STYLES.center]}
            >
                <View style={[{ backgroundColor: theme.COLORS.background, borderRadius: 18, paddingHorizontal: theme.SPACING.large, paddingVertical: theme.SPACING.xLarge, width: '85%' }]}>
                    <Text style={[globalStyles.title, { textAlign: 'center' }]}>{texts.title}</Text>
                    <Text style={[globalStyles.smallText, { textAlign: 'center', marginTop: theme.SPACING.small, marginBottom: theme.SPACING.xLarge }]}>
                        {texts.subtitle}
                    </Text>

                    {/* Input Email */}
                    <View style={[{paddingBottom: theme.SPACING.medium }]}>
                        <Text style={[globalStyles.label, { paddingBottom: theme.SPACING.small }]}>{texts.emailLabel}</Text>
                        <View style={theme.INPUT_STYLES.container}>
                            <SvgUri
                                uri={getIconUri(require('../assets/icon/mail.svg'))}
                                width={20}
                                height={20}
                                style={{ marginRight: theme.SPACING.small }}
                                color={theme.COLORS.placeholder}
                            />
                            <TextInput
                                style={[theme.INPUT_STYLES.text, { paddingVertical: theme.SPACING.medium }]}
                                placeholder={texts.emailPlaceholder}
                                placeholderTextColor={theme.COLORS.placeholder}
                                keyboardType="email-address"
                                value={email}
                                onChangeText={setEmail}
                            />
                        </View>
                    </View>

                    {/* Button "Réinitialiser" */}
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { width: '100%' }]} onPress={handleReset}>
                        <LinearGradient
                            colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[theme.BUTTON_STYLES.default, { width: '100%' }]}
                        >
                            <Text style={[globalStyles.text, { color: theme.COLORS.background, fontWeight: '900' }]}> {texts.resetButton} </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Back Button */}
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.small, marginTop: theme.SPACING.large }]} onPress={() => router.push('/connection')} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                        <Text style={[globalStyles.text, { color: theme.COLORS.icon, fontWeight: '700' }]}> {texts.backButton} </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.forgotPassword,
    fr: translationsFr.forgotPassword
};