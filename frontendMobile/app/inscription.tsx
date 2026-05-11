import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SvgUri } from 'react-native-svg';
import { theme, globalStyles } from '../constants/theme';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { getIconUri } from './icon-mapping';
import { addUser } from '@/api/services/users.api'

export default function InscriptionScreen() {
    const router = useRouter();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

    const passwordMismatch = confirmPasswordTouched && confirmPassword.length > 0 && password !== confirmPassword;

    const handleRegister = async() => {
        setConfirmPasswordTouched(true);

        if (password !== confirmPassword) {
            return;
        }

        const user = {
            email,
            username,
            password
        };

        await addUser(user)
        
        router.push('/connection')
    };


    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={[theme.CONTAINER_STYLES.center]} >
                <View style={[{ backgroundColor: theme.COLORS.background, borderRadius: 18, paddingHorizontal: theme.SPACING.large, paddingVertical: theme.SPACING.xLarge, width: '85%' }]}>
                    <Text style={[globalStyles.title, { textAlign: 'center' }]}>{texts.title}</Text>
                    <Text style={[globalStyles.smallText, { textAlign: 'center', marginTop: theme.SPACING.small, marginBottom: theme.SPACING.xLarge }]}>
                        {texts.subtitle}
                    </Text>

                    {/* Input Pseudo */}
                    <View style={{ marginBottom: theme.SPACING.medium }}>
                        <Text style={[globalStyles.label, { paddingBottom: theme.SPACING.small }]}>{texts.pseudoLabel}</Text>
                        <View style={theme.INPUT_STYLES.container}>
                            <SvgUri uri={getIconUri("user.svg")} width={20} height={20} style={{ marginRight: theme.SPACING.small }} color={theme.COLORS.placeholder} />
                            <TextInput
                                style={[theme.INPUT_STYLES.text, { paddingVertical: theme.SPACING.medium }]}
                                placeholder={texts.pseudoPlaceholder}
                                placeholderTextColor={theme.COLORS.placeholder}
                                value={username}
                                onChangeText={setUsername}
                            />                        
                        </View>
                    </View>

                    {/* Input Email */}
                    <View style={{ marginBottom: theme.SPACING.medium }}>
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
                    <View style={{ marginBottom: theme.SPACING.medium }}>
                        <Text style={[globalStyles.label, { paddingBottom: theme.SPACING.small }]}>{texts.passwordLabel}</Text>
                        <View style={theme.INPUT_STYLES.container}>
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
                    </View>

                    {/* Input Confirm Password */}
                    <View style={{ marginBottom: theme.SPACING.medium }}>
                        <Text style={[globalStyles.label, { paddingBottom: theme.SPACING.small }]}>{texts.confirmPasswordLabel}</Text>
                        <View style={theme.INPUT_STYLES.container}>
                            <SvgUri uri={getIconUri("lock.svg")} width={20} height={20} style={{ marginRight: theme.SPACING.small }} color={theme.COLORS.placeholder} />
                            <TextInput
                                style={[theme.INPUT_STYLES.text, { paddingVertical: theme.SPACING.medium }]}
                                placeholder={texts.confirmPasswordPlaceholder}
                                placeholderTextColor={theme.COLORS.placeholder}
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={(value) => {
                                    setConfirmPassword(value);
                                    if (!confirmPasswordTouched) {
                                        setConfirmPasswordTouched(true);
                                    }
                                }}
                                onBlur={() => setConfirmPasswordTouched(true)}
                            />
                        </View>
                        {passwordMismatch && (
                            <Text style={[globalStyles.tinyText, { color: theme.COLORS.error, marginTop: theme.SPACING.xsmall, textAlign: 'left', }]}>
                                {texts.confirmPasswordError}
                            </Text>
                        )}
                    </View>

                    {/* Registration Button */}
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { width: '100%' }]} onPress={handleRegister} >
                        <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%' }]} >
                            <Text style={[globalStyles.text, { color: theme.COLORS.background, fontWeight: '900' }]}>
                                {texts.signUpButton}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Link "Sign In" */}
                    <View style={{ marginTop: theme.SPACING.medium, marginBottom: theme.SPACING.large }}>
                        <Text style={globalStyles.tinyText}>{texts.alreadyHaveAccountText}</Text>
                        <TouchableOpacity onPress={() => router.push('/connection')} activeOpacity={0.7}>
                            <Text style={[globalStyles.tinyText, { color: theme.COLORS.secondary, fontWeight: '600' }]}>
                                {texts.signInLink}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Back Button */}
                    <TouchableOpacity style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.small }]} onPress={() => router.push('/')} activeOpacity={0.7}>
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
    en: translations.inscription,
    fr: translationsFr.inscription
};
