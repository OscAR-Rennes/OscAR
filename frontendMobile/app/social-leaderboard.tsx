import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../constants/theme';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import HeaderNavbar from '@/components/ui/header-navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavbar from '@/components/ui/bottom-navbar';
import SectionTitle from '../components/section-title';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { getIconUri } from './icon-mapping';
import { useAuth } from '../context/AuthContext';
import { getGlobalLeaderboard, getUserById } from '../api/services/users.api';

type LeaderboardUser = {
    id: string;
    username: string;
    points: number;
};

export default function SocialLeaderboardScreen() {
    const router = useRouter();
    const { isConnected, userId } = useAuth();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([]);
    const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
    const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);

                const data = await getGlobalLeaderboard(1000);
                const users = Array.isArray(data) ? data : [];
                setLeaderboardUsers(users);

                if (isConnected && userId) {
                    const userData = await getUserById(userId);

                    if (userData) {
                        setCurrentUser({
                            id: userData.id,
                            username: userData.username,
                            points: userData.points,
                        });

                        const rankIndex = users.findIndex((user) => user.id === userId);
                        setCurrentUserRank(rankIndex >= 0 ? rankIndex + 1 : null);
                    }
                }
            } catch (error) {
                console.error('Error fetching leaderboard:', error);
                setLeaderboardUsers([]);
                setCurrentUser(null);
                setCurrentUserRank(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, [isConnected, userId]);

    const topTenUsers = leaderboardUsers.slice(0, 10);

    const renderRow = (user: LeaderboardUser, rankLabel: string | number, isHighlighted = false) => {
        const rowContent = (
            <View
                style={{
                    borderRadius: 5,
                    paddingHorizontal: theme.SPACING.medium,
                    paddingVertical: theme.SPACING.medium,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isHighlighted ? '#fff6f6' : theme.COLORS.background,
                    borderWidth: 1,
                    borderColor: isHighlighted ? 'transparent' : theme.COLORS.border,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: theme.SPACING.small }}>
                    <View
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: theme.COLORS.primary,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexShrink: 0,
                        }}
                    >
                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }}>
                            {rankLabel}
                        </Text>
                    </View>
                    <Text
                        style={{
                            fontSize: theme.FONT_SIZES.text,
                            color: theme.COLORS.textPrimary,
                            fontWeight: isHighlighted ? '800' : '700',
                            marginLeft: theme.SPACING.medium,
                            flexShrink: 1,
                        }}
                        numberOfLines={1}
                    >
                        {user.username}
                    </Text>
                </View>
                <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary, fontWeight: '700' }}>
                    {user.points}pts
                </Text>
            </View>
        );

        if (!isHighlighted) {
            return (
                <View key={`${user.id}-${rankLabel}-top`}>
                    {rowContent}
                </View>
            );
        }

        return (
            <LinearGradient
                key={`${user.id}-${rankLabel}-current`}
                colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    padding: 3,
                    borderRadius: theme.SPACING.small,
                }}
            >
                {rowContent}
            </LinearGradient>
        );
    };

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

                {/* Global Leaderboard */}
                <View style={{ borderWidth: 1, borderColor: theme.COLORS.border, borderRadius: 8, backgroundColor: theme.COLORS.background, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, marginTop: theme.SPACING.medium }}>
                    <SectionTitle 
                        title={texts.leaderboardTitle} 
                        iconUri={getIconUri("trophy.svg")} 
                        iconColor={theme.COLORS.secondary} 
                    />

                    {isLoading ? (
                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.leaderboardPlaceholder}</Text>
                    ) : topTenUsers.length > 0 ? (
                        <View style={{ gap: theme.SPACING.small }}>
                            {topTenUsers.map((user, index) => renderRow(user, index + 1, currentUserRank === index + 1 && currentUser?.id === user.id))}

                            {currentUser && (currentUserRank === null || currentUserRank > 10) && (
                                <>
                                    <Text style={{ textAlign: 'center', color: theme.COLORS.textSecondary, fontSize: theme.FONT_SIZES.subtitle, marginVertical: theme.SPACING.small }}>
                                        ...
                                    </Text>
                                    {renderRow(currentUser, currentUserRank ?? '+1000', true)}
                                </>
                            )}
                        </View>
                    ) : (
                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.leaderboardPlaceholder}</Text>
                    )}
                </View>
            </ScrollView>

            <BottomNavbar/>
        </SafeAreaView>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.socialLeaderboard,
    fr: translationsFr.socialLeaderboard
};