import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { Asset } from 'expo-asset';
import { theme, globalStyles } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';

export default function ConnexionScreen() {
    const router = useRouter();
    const { language } = useLanguage(); // Retrieve current language
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts

    // Get URI from icon module
    function getIconUri(iconSource: number): string {
        return Asset.fromModule(iconSource).uri || '';
    }

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
                    <View style={[{ paddingBottom: theme.SPACING.medium }]}>
                        <Text style={[globalStyles.label, { paddingBottom: theme.SPACING.small }]}>{texts.emailLabel}</Text>
                        <View style={theme.INPUT_STYLES.container}>
                            <SvgUri
                                uri={getIconUri(require('../../assets/icon/mail.svg'))}
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
                            />
                        </View>
                    </View>

                    {/* Input Password */}
                    <View>
                        <Text style={[globalStyles.label, { paddingBottom: theme.SPACING.small }]}>{texts.passwordLabel}</Text>
                        <View style={[theme.INPUT_STYLES.container, { marginBottom: theme.SPACING.small }]}>
                            <SvgUri
                                uri={getIconUri(require('../../assets/icon/lock.svg'))}
                                width={20}
                                height={20}
                                style={{ marginRight: theme.SPACING.small }}
                                color={theme.COLORS.placeholder}
                            />
                            <TextInput
                                style={[theme.INPUT_STYLES.text, { paddingVertical: theme.SPACING.medium }]}
                                placeholder={texts.passwordPlaceholder}
                                placeholderTextColor={theme.COLORS.placeholder}
                                secureTextEntry
                            />
                        </View>

                        {/* Link "Forgot Password?" */}
                        <TouchableOpacity onPress={() => router.push('/forgot-password')} activeOpacity={0.7}>
                            <Text style={[globalStyles.tinyText, { color: theme.COLORS.secondary, marginBottom: theme.SPACING.large, fontWeight: '600' }]}>
                                {texts.forgotPassword}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Button "Sign In" */}
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { width: '100%' }]}>
                        <LinearGradient
                            colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[theme.BUTTON_STYLES.default, { width: '100%' }]}
                        >
                            <Text style={[globalStyles.text, { color: theme.COLORS.background, fontWeight: '900', paddingHorizontal: theme.SPACING.large }]}>
                                {texts.signInButton}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Link "Sign Up" */}
                    <View style={{ marginTop: theme.SPACING.medium, marginBottom: theme.SPACING.large }}>
                        <Text style={globalStyles.tinyText}>{texts.noAccountText}</Text>
                        <TouchableOpacity onPress={() => router.push('/inscription')} activeOpacity={0.7}>
                            <Text style={[globalStyles.tinyText, { color: theme.COLORS.secondary, fontWeight: '600' }]}>
                                {texts.signUpLink}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Back Button */}
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.small }]} onPress={() => router.push('/')} activeOpacity={0.7}>
                        <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                        <Text style={[globalStyles.text, { color: theme.COLORS.icon, fontWeight: '700' }]}>
                            {texts.backButton}
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </View>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    fr: {
        title: "LOOTOPIA",
        subtitle: "La chasse vous attend !",
        emailLabel: "Email",
        emailPlaceholder: "votre@email.com",
        passwordLabel: "Mot de passe",
        passwordPlaceholder: "************",
        forgotPassword: "Mot de passe oublié ?",
        signInButton: "Se connecter",
        noAccountText: "Vous n'avez pas encore de compte ?",
        signUpLink: "Inscrivez-vous !",
        backButton: "Retour au menu",
    },
    en: {
        title: "LOOTOPIA",
        subtitle: "The hunt awaits you!",
        emailLabel: "Email",
        emailPlaceholder: "your@email.com",
        passwordLabel: "Password",
        passwordPlaceholder: "************",
        forgotPassword: "Forgot password?",
        signInButton: "Sign In",
        noAccountText: "Don't have an account yet ?",
        signUpLink: "Sign up !",
        backButton: "Back to menu",
    },
};
