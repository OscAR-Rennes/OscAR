import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderNavbar from '@/components/ui/header-navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '@/components/ui/bottom-navbar';
import { SvgUri } from 'react-native-svg';
import AddFriends from '../components/add-friends';
import SectionTitle from '../components/section-title';
import { useLanguage } from '../context/LanguageContext'; // Import du contexte de langue
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';

// Icon mapping
const ICONS = {
    "trophy.svg": require('../assets/icon/trophy.svg'),
    "plus.svg": require('../assets/icon/plus.svg'),
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

// Social Friends screen

export default function SocialFriendsScreen() {
    const router = useRouter();
    const { language } = useLanguage(); // Retrieve the current language
    const texts = STATIC_TEXTS[language]; // Retrieve translated texts

    return (
        <SafeAreaView style={{backgroundColor: theme.COLORS.background, flex: 1}}>
            <HeaderNavbar/>

            <View style={{flex: 1, paddingHorizontal: theme.SPACING.large, paddingVertical: theme.SPACING.medium}}>

                {/* Back Button */}
                <TouchableOpacity style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.medium, justifyContent: 'flex-start' }]} onPress={() => router.push('/social')} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                    <Text style={[{ color: theme.COLORS.icon, fontWeight: '500', fontSize: 20 }]}>
                        {texts.backButton}
                    </Text>
                </TouchableOpacity>

                {/* Friends Leaderboard */}
                <View style={{ borderRadius: 8, borderColor: theme.COLORS.border, borderWidth: 1, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, marginTop: theme.SPACING.medium }}>
                    <SectionTitle 
                        title={texts.leaderboardTitle} 
                        iconUri={getIconUri("trophy.svg")} 
                        iconColor={theme.COLORS.secondary} 
                    />
                    <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.leaderboardPlaceholder}</Text>

                    {/* Add friends button */}
                    <AddFriends />
                </View>
            </View>

            <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <BottomNavbar/>
            </View>
        </SafeAreaView>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.socialFriends,
    fr: translationsFr.socialFriends
};
