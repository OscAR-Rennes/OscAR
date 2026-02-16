import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { theme, globalStyles } from '../../constants/theme';
import PlaceholderNotConnected from '../../components/placeholder-not-connected';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { Asset } from 'expo-asset';
import { SvgUri } from 'react-native-svg';
import PageTitle from '../../components/page-title';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';

// Icon mapping
const ICONS = {
    "target-larger.svg": require('../../assets/icon/target-larger.svg'),
    "check.svg": require('../../assets/icon/check.svg'),
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

// HuntSection component for each section (Current Hunts, Completed Hunts)
const HuntSection = ({ title, icon, iconColor, placeholderIcon, placeholderMessage, buttonText, isAuthenticated, authMessage }: { title: string; icon: IconName; iconColor: string; placeholderIcon: string; placeholderMessage: string; buttonText: string; isAuthenticated: boolean; authMessage: string }) => {
    const router = useRouter();

    return (
        <View style={{ flexDirection: 'column', marginBottom: theme.SPACING.medium }}>
            <View style={{ flexDirection: 'row', marginBottom: theme.SPACING.medium, alignItems: 'center' }}>
                <SvgUri uri={getIconUri(icon)} width={25} height={25} color={iconColor} />
                <Text style={{ ...globalStyles.subtitle, fontSize: theme.FONT_SIZES.text, marginLeft: theme.SPACING.small }}>{title}</Text>
            </View>
            {isAuthenticated ? (
                <Text style={{ color: theme.COLORS.textSecondary }}>{authMessage}</Text>
            ) : (
                <PlaceholderNotConnected
                    icon={placeholderIcon as any}
                    message={placeholderMessage}
                    buttonText={buttonText}
                    onPress={() => router.push('/connection')}
                />
            )}
        </View>
    );
};

// Hunt screen
export default function HuntScreen() {
    const { isAuthenticated } = useAuth();
    const { language } = useLanguage(); // Retrieve current language
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: theme.SPACING.large }}>
                <PageTitle title={texts.pageTitle} />
                <HuntSection
                    title={texts.currentHuntsTitle}
                    icon="target-larger.svg"
                    iconColor={theme.COLORS.primary}
                    placeholderIcon="target-larger.svg"
                    placeholderMessage={texts.currentHuntsPlaceholderMessage}
                    buttonText={texts.connectButtonText}
                    isAuthenticated={isAuthenticated}
                    authMessage={texts.currentHuntsAuthMessage}
                />
                <HuntSection
                    title={texts.completedHuntsTitle}
                    icon="check.svg"
                    iconColor={theme.COLORS.success}
                    placeholderIcon="target-larger.svg"
                    placeholderMessage={texts.completedHuntsPlaceholderMessage}
                    buttonText={texts.connectButtonText}
                    isAuthenticated={isAuthenticated}
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