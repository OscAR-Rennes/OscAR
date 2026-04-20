import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { theme, globalStyles } from '../constants/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderNavbar from '@/components/ui/header-navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '@/components/ui/bottom-navbar';
import AddFriends from '../components/add-friends';
import SectionTitle from '../components/section-title';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { getIconUri } from './icon-mapping';

export default function SocialFriendsScreen() {
    const router = useRouter();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    return (
        <SafeAreaView style={{backgroundColor: theme.COLORS.background, flex: 1}}>
            <HeaderNavbar/>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: theme.SPACING.large,
                    paddingVertical: theme.SPACING.medium,
                    paddingBottom: theme.SPACING.xLarge + 50,
                }}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
            >

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
            </ScrollView>

            <BottomNavbar/>
        </SafeAreaView>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.socialFriends,
    fr: translationsFr.socialFriends
};
