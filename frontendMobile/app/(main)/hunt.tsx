import React from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import PageTitle from '../../components/page-title';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import HuntSection from '../../components/hunt-section';

export default function HuntScreen() {
    const { isConnected } = useAuth();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: theme.SPACING.large }}>
                <PageTitle title={texts.pageTitle} />
                
                {/* Current Hunts Section */}
                <HuntSection
                    title={texts.currentHuntsTitle}
                    icon="target-larger.svg"
                    iconColor={theme.COLORS.primary}
                    placeholderIcon="target-larger.svg"
                    placeholderMessage={texts.currentHuntsPlaceholderMessage}
                    buttonText={texts.connectButtonText}
                    isAuthenticated={isConnected}
                    authMessage={texts.currentHuntsAuthMessage}
                />

                {/* Completed Hunts Section */}
                <HuntSection
                    title={texts.completedHuntsTitle}
                    icon="check.svg"
                    iconColor={theme.COLORS.success}
                    placeholderIcon="target-larger.svg"
                    placeholderMessage={texts.completedHuntsPlaceholderMessage}
                    buttonText={texts.connectButtonText}
                    isAuthenticated={isConnected}
                    authMessage={texts.completedHuntsAuthMessage}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.hunt,
    fr: translationsFr.hunt
};