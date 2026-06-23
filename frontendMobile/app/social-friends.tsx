import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { theme } from '../constants/theme';
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
import { getFriendLeaderboard, getPendingRequests, acceptFriendRequest, refuseFriendRequest } from '@/api/services/friend.api';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';

export default function SocialFriendsScreen() {
    const router = useRouter();
    const { language } = useLanguage();
    const { userId, isConnected } = useAuth();
    const texts = STATIC_TEXTS[language];

    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        const [lb, pending] = await Promise.all([
            getFriendLeaderboard(),
            getPendingRequests(),
        ]);
        setLeaderboard(lb ?? []);
        setPendingRequests(pending ?? []);
    };

    useEffect(() => {
        fetchData().finally(() => setLoading(false));
    }, []);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, []);

    const handleAccept = async (id: string) => {
        await acceptFriendRequest(id);
        await fetchData();
    };

    const handleRefuse = async (id: string) => {
        await refuseFriendRequest(id);
        await fetchData();
    };

    return (
        <SafeAreaView style={{ backgroundColor: theme.COLORS.background, flex: 1 }}>
            <HeaderNavbar />

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingHorizontal: theme.SPACING.large, paddingVertical: theme.SPACING.medium, paddingBottom: theme.SPACING.xLarge + 50 }}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <TouchableOpacity style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.medium, justifyContent: 'flex-start' }]} onPress={() => router.push('/social')} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                    <Text style={{ color: theme.COLORS.icon, fontWeight: '500', fontSize: 20 }}>{texts.backButton}</Text>
                </TouchableOpacity>

                {/* Demandes en attente */}
                {pendingRequests.length > 0 && (
                    <View style={{ borderRadius: 8, borderColor: theme.COLORS.border, borderWidth: 1, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, marginTop: theme.SPACING.medium }}>
                        <SectionTitle title={'Demandes en attente'} iconUri={getIconUri('group.svg')} iconColor={theme.COLORS.primary} />
                        {pendingRequests.map((req) => (
                            <View key={req.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: theme.SPACING.small }}>
                                <Text style={{ fontWeight: '600', color: theme.COLORS.textPrimary }}>{req.applicant?.username}</Text>
                                <View style={{ flexDirection: 'row', gap: theme.SPACING.small }}>
                                    <TouchableOpacity onPress={() => handleAccept(req.id)} style={{ backgroundColor: '#2eb85c', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                                        <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleRefuse(req.id)} style={{ backgroundColor: '#e74c3c', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                                        <Text style={{ color: '#fff', fontWeight: '700' }}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Leaderboard */}
                <View style={{ borderRadius: 8, borderColor: theme.COLORS.border, borderWidth: 1, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, marginTop: theme.SPACING.medium }}>
                    <SectionTitle title={texts.leaderboardTitle} iconUri={getIconUri("trophy.svg")} iconColor={theme.COLORS.secondary} />

                    {loading ? (
                        <ActivityIndicator color={theme.COLORS.primary} />
                    ) : leaderboard.length === 0 ? (
                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.leaderboardPlaceholder}</Text>
                    ) : (
                        <View style={{ gap: theme.SPACING.small }}>
                            {leaderboard.map((friend, index) => {
                                const isCurrentUser = isConnected && friend.id === userId;
                                const rowContent = (
                                    <View
                                        style={{
                                            borderRadius: theme.SPACING.small,
                                            paddingHorizontal: theme.SPACING.medium,
                                            paddingVertical: theme.SPACING.medium,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            backgroundColor: isCurrentUser ? '#fff6f6' : theme.COLORS.background,
                                            borderWidth: isCurrentUser ? 0 : 1,
                                            borderColor: theme.COLORS.border,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                                            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }}>{index + 1}</Text>
                                            </View>
                                            <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textPrimary, fontWeight: isCurrentUser ? '800' : '700', marginLeft: theme.SPACING.medium }} numberOfLines={1}>
                                                {friend.username}
                                            </Text>
                                        </View>
                                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary, fontWeight: '700' }}>
                                            {friend.points} {texts.pointsSuffix}
                                        </Text>
                                    </View>
                                );

                                if (!isCurrentUser) return <View key={friend.id}>{rowContent}</View>;

                                return (
                                    <LinearGradient
                                        key={friend.id}
                                        colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ padding: 3, borderRadius: theme.SPACING.small }}
                                    >
                                        {rowContent}
                                    </LinearGradient>
                                );
                            })}
                        </View>
                    )}

                    <AddFriends />
                </View>
            </ScrollView>

            <BottomNavbar />
        </SafeAreaView>
    );
}

const STATIC_TEXTS = {
    en: translations.socialFriends,
    fr: translationsFr.socialFriends
};