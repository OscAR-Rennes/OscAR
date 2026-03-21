import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { theme, globalStyles } from '../../constants/theme';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import { getIconUri } from '../icon-mapping';
import { logUser } from '@/api/services/auth.api'
import { useAuth } from '@/context/AuthContext';
import * as SecureStore from "expo-secure-store";

export default function ConnexionScreen() {
    const router = useRouter();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const { login } = useAuth();
    
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const handleLogin = async () => {
        const credentials = { email, password };
        const response = await logUser(credentials);

        await SecureStore.setItemAsync("token", response.token);
        login(response.id);
    };


    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[theme.CONTAINER_STYLES.center]} >
                <View style={[{ backgroundColor: theme.COLORS.background, borderRadius: 18, paddingHorizontal: theme.SPACING.large, paddingVertical: theme.SPACING.xLarge, width: '85%' }]}>
                    <Text style={[globalStyles.title, { textAlign: 'center' }]}>{texts.title}</Text>
                    <Text style={[globalStyles.smallText, { textAlign: 'center', marginTop: theme.SPACING.small, marginBottom: theme.SPACING.xLarge }]}>
                        {texts.subtitle}
                    </Text>

                    {/* Input Email */}
                    <View style={[{ paddingBottom: theme.SPACING.medium }]}>
                        <Text style={[globalStyles.label, { paddingBottom: theme.SPACING.small }]}>{texts.emailLabel}</Text>
                        <View style={theme.INPUT_STYLES.container}>
                            <SvgUri uri={getIconUri("mail.svg")} width={20} height={20} style={{ marginRight: theme.SPACING.small }} color={theme.COLORS.placeholder} />
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

                    {/* Input Password */}
                    <View>
                        <Text style={[globalStyles.label, { paddingBottom: theme.SPACING.small }]}>{texts.passwordLabel}</Text>
                        <View style={[theme.INPUT_STYLES.container, { marginBottom: theme.SPACING.small }]}>
                            <SvgUri uri={getIconUri("lock.svg")} width={20} height={20} style={{ marginRight: theme.SPACING.small }} color={theme.COLORS.placeholder} />
                            <TextInput
                                style={[theme.INPUT_STYLES.text, { paddingVertical: theme.SPACING.medium }]}
                                placeholder={texts.passwordPlaceholder}
                                placeholderTextColor={theme.COLORS.placeholder}
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
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
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { width: '100%' }]} onPress={handleLogin} >
                        <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%' }]} >
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
    en: translations.connection,
    fr: translationsFr.connection
};
