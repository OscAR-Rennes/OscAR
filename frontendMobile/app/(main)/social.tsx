import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, RefreshControl, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import PlaceholderNotConnected from '../../components/placeholder-not-connected';
import { router } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import SectionTitle from '../../components/section-title';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import { getIconUri } from '../icon-mapping';
import { getGlobalLeaderboard } from '../../api/services/users.api';
import { getFriendLeaderboard, getPendingRequests, acceptFriendRequest, refuseFriendRequest } from '../../api/services/friend.api';

type LeaderboardUser = {
    id: string;
    username: string;
    points: number;
};

type PendingRequest = {
    id: string;
    applicant: {
        id: string;
        username: string;
        picture_path?: string;
        points: number;
    };
};

export default function SocialScreen() {
    const { isConnected, userId } = useAuth();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language] as any;

    const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardUser[]>([]);
    const [friendLeaderboard, setFriendLeaderboard] = useState<LeaderboardUser[]>([]);
    const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
    const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        const promises: Promise<any>[] = [getGlobalLeaderboard(5)];

        if (isConnected) {
            promises.push(getFriendLeaderboard(), getPendingRequests());
        }

        const [global, friends, pending] = await Promise.all(promises);
        setGlobalLeaderboard(Array.isArray(global) ? global : []);
        setFriendLeaderboard(Array.isArray(friends) ? friends.slice(0, 3) : []);
        setPendingRequests(Array.isArray(pending) ? pending : []);
    };

    useEffect(() => {
        fetchData().finally(() => setIsLeaderboardLoading(false));
    }, [isConnected]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    }, [isConnected]);

    const handleAccept = async (id: string) => {
        await acceptFriendRequest(id);
        await fetchData();
    };

    const handleRefuse = async (id: string) => {
        await refuseFriendRequest(id);
        await fetchData();
    };

    return (
        <ScrollView
            contentContainerStyle={{
                paddingTop: theme.SPACING.small,
                paddingHorizontal: theme.SPACING.medium,
                paddingBottom: theme.SPACING.xLarge + 50,
            }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >

            {/* Friend Requests */}
            {isConnected && (
                <View style={{ borderWidth: 1, borderColor: theme.COLORS.border, borderRadius: 8, backgroundColor: theme.COLORS.background, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, marginTop: theme.SPACING.medium }}>
                    <SectionTitle
                        title={texts.friendRequestsTitle}
                        iconUri={getIconUri("envelope.svg")}
                        iconColor={theme.COLORS.success}
                    />
                    {pendingRequests.length === 0 ? (
                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.friendRequestsListMessage}</Text>
                    ) : (
                        pendingRequests.map((req) => (
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
                        ))
                    )}
                </View>
            )}

            {/* Friends Leaderboard */}
            <View style={{ borderRadius: 8, borderColor: theme.COLORS.border, borderWidth: 1, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, marginTop: theme.SPACING.medium }}>
                <SectionTitle
                    title={texts.friendsLeaderboardTitle}
                    iconUri={getIconUri("trophy.svg")}
                    iconColor={theme.COLORS.secondary}
                />
                {!isConnected ? (
                    <PlaceholderNotConnected
                        icon="group.svg"
                        message={texts.friendRequestsPlaceholderMessage}
                        buttonText={texts.connectButtonText}
                        onPress={() => router.push('/connection')}
                    />
                ) : isLeaderboardLoading ? (
                    <ActivityIndicator color={theme.COLORS.primary} />
                ) : friendLeaderboard.length === 0 ? (
                    <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.friendsListMessage}</Text>
                ) : (
                    <View style={{ gap: theme.SPACING.small }}>
                        {friendLeaderboard.map((friend, index) => {
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

                <TouchableOpacity style={{ width: '100%', marginTop: theme.SPACING.medium }} onPress={() => router.push('/social-friends')}>
                    <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, height: 35 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                            <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }}>{texts.seeMoreButtonText}</Text>
                            <SvgUri uri={getIconUri("plus.svg")} width={20} height={20} color={theme.COLORS.background} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            {/* Global Leaderboard */}
            <View style={{ borderWidth: 1, borderColor: theme.COLORS.border, borderRadius: 8, backgroundColor: theme.COLORS.background, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, marginTop: theme.SPACING.medium }}>
                <SectionTitle
                    title={texts.globalLeaderboardTitle}
                    iconUri={getIconUri("trophy.svg")}
                    iconColor={theme.COLORS.secondary}
                />

                {isLeaderboardLoading ? (
                    <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.globalLeaderboardLoading}</Text>
                ) : globalLeaderboard.length > 0 ? (
                    <View style={{ gap: theme.SPACING.small }}>
                        {globalLeaderboard.map((player, index) => {
                            const isCurrentUser = isConnected && player.id === userId;
                            const rowContent = (
                                <View
                                    key={player.id}
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
                                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }}>{index + 1}</Text>
                                        </View>
                                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textPrimary, fontWeight: isCurrentUser ? '800' : '700', marginLeft: theme.SPACING.medium }} numberOfLines={1}>
                                            {player.username}
                                        </Text>
                                    </View>
                                    <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary, fontWeight: '700' }}>
                                        {player.points} {texts.pointsSuffix}
                                    </Text>
                                </View>
                            );

                            if (!isCurrentUser) return <View key={player.id}>{rowContent}</View>;

                            return (
                                <LinearGradient
                                    key={player.id}
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
                ) : (
                    <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.globalLeaderboardEmpty}</Text>
                )}

                <TouchableOpacity style={{ width: '100%', marginTop: theme.SPACING.medium }} onPress={() => router.push('/social-leaderboard')}>
                    <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, height: 35 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                            <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }}>{texts.seeMoreButtonText}</Text>
                            <SvgUri uri={getIconUri("plus.svg")} width={20} height={20} color={theme.COLORS.background} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const STATIC_TEXTS = {
    en: translations.social,
    fr: translationsFr.social
};