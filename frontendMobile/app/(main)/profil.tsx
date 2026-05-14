import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../../constants/theme';
import StatsCard from '../../components/ui/stats-card';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import { getIconUri } from '../icon-mapping';
import { useAuth } from '@/context/AuthContext';
import { getUserById } from '@/api/services/users.api'
import { FullUserDTO } from '@/common/dto/IUser'
import { getTotalProgression } from '@/api/services/progression.api';
import { ProgressionItem } from '../../common/dto/IProgressionItem';
import { HuntDetailsResponse } from '../../common/dto/IFullHunt';
import { getHuntById } from '@/api/services/hunt.api';
import { HuntSectionItem } from '@/common/dto/IHuntSectionProps';
import { getFriendLeaderboard } from '@/api/services/friend.api';

export default function ProfilScreen() {
    const router = useRouter();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];

    const { userId, logout } = useAuth()

    const [user, setUser] = useState<FullUserDTO | null>(null)
    const [completedHunts, setCompletedHunts] = useState<HuntSectionItem[]>([]);
    const [friends, setFriends] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getUserById(userId);
            setUser(data)
            const progression = await getTotalProgression();
            const progressionItems: ProgressionItem[] = Array.isArray(progression) ? progression : [];
            const huntsWithTitles = await Promise.all(
                progressionItems.map(async (item) => {
                    const hunt = await getHuntById(item.hunt_id) as HuntDetailsResponse;

                    const totalSteps = Array.isArray(hunt?.steps)
                        ? hunt.steps.length
                        : typeof hunt?.steps === 'number'
                            ? hunt.steps
                            : 0;

                    return {
                        id: item.hunt_id,
                        title: hunt?.title ?? item.hunt_id,
                        completedPoints: typeof item.completed_points === 'number' ? item.completed_points : 0,
                        totalPoints: typeof item.total_points === 'number' ? item.total_points : (typeof hunt?.points === 'number' ? hunt.points : 0),
                        completedSteps: typeof item.completed_steps === 'number' ? item.completed_steps : 0,
                        totalSteps: typeof item.total_steps === 'number' ? item.total_steps : totalSteps,
                        totalIndexes: typeof item.total_indexes === 'number' ? item.total_indexes : undefined,
                        culturalCenterName: hunt?.culturalCenter?.name,
                        currentIndex: item.current_index?.index,
                        isComplete: item.isComplete,
                    };
                })
            );

            setCompletedHunts(
                huntsWithTitles
                    .filter((hunt) => hunt.isComplete)
                    .map(({ id, title, totalPoints, totalSteps, totalIndexes, culturalCenterName }) => ({
                        id,
                        title,
                        completedPoints: totalPoints,
                        totalPoints,
                        completedSteps: totalSteps,
                        totalSteps,
                        totalIndexes,
                        culturalCenterName,
                    }))
            );

            const friends = await getFriendLeaderboard();
            setFriends(friends.length - 1);

        };
        fetchData()
    }, [])

    return (
        <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ paddingHorizontal: theme.SPACING.large, paddingVertical: theme.SPACING.xLarge }}>
                {/* Profile Picture */}
                <View style={{ alignItems: 'center', marginBottom: theme.SPACING.large }}>
                    <View style={{ width: 140, height: 140, borderRadius: 500, backgroundColor: '#dfdfdf', justifyContent: 'center', alignItems: 'center' }}>
                        <SvgUri uri={getIconUri("image-placeholder.svg")} width={60} height={60} color={theme.COLORS.background} />
                    </View>
                    <Text style={{ fontSize: 25, fontWeight: '700', color: theme.COLORS.textPrimary, marginTop: theme.SPACING.small }}>{user?.username}</Text>
                </View>

                {/* Total Points Section */}
                <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 1, y: 0 }} end={{ x: 0.3, y: 0 }} style={[{ width: '100%', paddingHorizontal: theme.SPACING.medium, paddingVertical: theme.SPACING.medium, borderRadius: 12, marginBottom: theme.SPACING.medium, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]} >
                    <View>
                        <Text style={[{ color: theme.COLORS.background, fontWeight: '900' }]}>{texts.totalPointsTitle}</Text>
                        <Text style={[{ color: theme.COLORS.background, fontSize: 30, fontWeight: '900' }]}>{user?.points}</Text>
                    </View>
                    <View>
                        <SvgUri uri={getIconUri("trophy.svg")} width={60} height={60} color={theme.COLORS.background} />
                    </View>
                </LinearGradient>

                {/* Stats Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: theme.SPACING.large, gap: theme.SPACING.medium }}>
                    <StatsCard icon="target-larger.svg" value={completedHunts.length} label={texts.statsHuntLabel} backgroundColor="#fce4ec" iconColor={theme.COLORS.primary} width={30} height={30} />
                    {/* <StatsCard icon="pin.svg" value={0} label={texts.statsCulturalCenterLabel} backgroundColor="#fff9c4" iconColor={theme.COLORS.secondary} width={30} height={30} /> */}
                    <StatsCard icon="group.svg" value={friends} label={texts.statsFriendsLabel} backgroundColor="#e3f2fd" iconColor={theme.COLORS.tertiary} width={35} height={35} />
                </View>

                {/* Buttons */}
                {/* <TouchableOpacity style={{ width: '100%', paddingVertical: theme.SPACING.medium, borderRadius: 12, backgroundColor: theme.COLORS.background, borderWidth: 1, borderColor: theme.COLORS.border, marginBottom: theme.SPACING.medium }} onPress={() => router.push('/profil-modify')} >
                    <Text style={{ fontSize: theme.FONT_SIZES.text, fontWeight: '700', color: theme.COLORS.textPrimary, textAlign: 'center' }}>{texts.modifyProfileButton}</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={{ width: '100%', paddingVertical: theme.SPACING.medium, borderRadius: 12, backgroundColor: '#ffebee', borderWidth: 1, borderColor: theme.COLORS.error }} onPress={logout}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                        <SvgUri uri={getIconUri("logout.svg")} width={25} height={25} color={theme.COLORS.error} />
                        <Text style={{ fontSize: theme.FONT_SIZES.text, fontWeight: '700', color: theme.COLORS.error }}>{texts.logoutButton}</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.profil,
    fr: translationsFr.profil
};
