import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';
import PlaceholderNotConnected from '../../components/placeholder-not-connected';
import { router } from 'expo-router';
import { SvgUri } from 'react-native-svg';
import { TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SectionTitle from '../../components/section-title';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import { getIconUri } from '../icon-mapping';
import { getGlobalLeaderboard } from '../../api/services/users.api';

type LeaderboardUser = {
    id: string;
    username: string;
    points: number;
};

export default function SocialScreen() {
    const { isConnected } = useAuth();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language] as {
        friendRequestsTitle: string;
        friendRequestsPlaceholderMessage: string;
        friendsLeaderboardTitle: string;
        globalLeaderboardTitle: string;
        globalLeaderboardMessage: string;
        globalLeaderboardLoading: string;
        globalLeaderboardEmpty: string;
        pointsSuffix: string;
        connectButtonText: string;
        seeMoreButtonText: string;
        friendRequestsListMessage: string;
        friendsListMessage: string;
    };

    const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardUser[]>([]);
    const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(true);

    useEffect(() => {
        const fetchGlobalLeaderboard = async () => {
            setIsLeaderboardLoading(true);
            const data = await getGlobalLeaderboard(5);
            setGlobalLeaderboard(Array.isArray(data) ? data : []);
            setIsLeaderboardLoading(false);
        };

        fetchGlobalLeaderboard();
    }, []);

    return (
        <ScrollView
            contentContainerStyle={{
                paddingTop: theme.SPACING.small,
                paddingHorizontal: theme.SPACING.medium,
                paddingBottom: theme.SPACING.xLarge + 50,
            }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
        >
            
            {/* Friend Requests - Display only if user is authenticated */}
            {isConnected && (
                <View style={{ borderWidth: 1, borderColor: theme.COLORS.border, borderRadius: 8, backgroundColor: theme.COLORS.background, paddingVertical: theme.SPACING.large, paddingHorizontal: theme.SPACING.medium, marginTop: theme.SPACING.medium }}>
                    <SectionTitle 
                        title={texts.friendRequestsTitle} 
                        iconUri={getIconUri("envelope.svg")} 
                        iconColor={theme.COLORS.success} 
                    />
                    <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.friendRequestsListMessage}</Text>
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
                ) : (
                    <>
                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.friendsListMessage}</Text>

                        {/* All friends button */}
                        <TouchableOpacity style={[{ width: '100%', marginTop: theme.SPACING.medium }]} onPress={() => router.push('/social-friends')}>
                            <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, height: 35 }]} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                                    <Text style={[{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }]}>{texts.seeMoreButtonText}</Text>
                                    <SvgUri uri={getIconUri("plus.svg")} width={20} height={20} color={theme.COLORS.background} />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </>
                )}
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
                        {globalLeaderboard.map((player, index) => (
                            <View
                                key={player.id}
                                style={{
                                    borderWidth: 1,
                                    borderColor: theme.COLORS.border,
                                    borderRadius: theme.SPACING.small,
                                    paddingHorizontal: theme.SPACING.medium,
                                    paddingVertical: theme.SPACING.medium,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                    <View
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 20,
                                            backgroundColor: theme.COLORS.primary,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }}>
                                            {index + 1}
                                        </Text>
                                    </View>
                                    <Text
                                        style={{
                                            fontSize: theme.FONT_SIZES.text,
                                            color: theme.COLORS.textPrimary,
                                            fontWeight: '700',
                                            marginLeft: theme.SPACING.medium,
                                        }}
                                        numberOfLines={1}
                                    >
                                        {player.username}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary, fontWeight: '700' }}>
                                    {player.points} {texts.pointsSuffix}
                                </Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text style={{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.textSecondary }}>{texts.globalLeaderboardEmpty}</Text>
                )}

                {/* All leaderboard informations */}
                <TouchableOpacity style={[{ width: '100%', marginTop: theme.SPACING.medium }]} onPress={() => router.push('/social-leaderboard')}>
                    <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 20, height: 35 }]} >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                            <Text style={[{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }]}>{texts.seeMoreButtonText}</Text>
                            <SvgUri uri={getIconUri("plus.svg")} width={20} height={20} color={theme.COLORS.background} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.social,
    fr: translationsFr.social
};