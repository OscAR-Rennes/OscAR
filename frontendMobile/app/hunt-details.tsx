import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import HeaderNavbar from '@/components/ui/header-navbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavbar from '@/components/ui/bottom-navbar';
import { globalStyles, theme } from '../constants/theme';
import { SvgUri } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import translations from '../constants/language-en.json';
import translationsFr from '../constants/language-fr.json';
import { LightStepDTO } from '../common/dto/ILightStep';
import { getIconUri } from './icon-mapping';
import { getStepByHunt } from '@/api/services/step.api'
import { getProgressionByHunt } from '@/api/services/progression.api';
import { useAuth } from '@/context/AuthContext';

type ProgressionByHunt = {
    hunt_id: string;
    isComplete: boolean;
    current_index?: {
        id: string;
        index: number;
        remaining_steps: {
            id: string;
            title: string;
        }[];
    };
};

type GroupedSteps = {
    indexNumber: number;
    steps: LightStepDTO[];
};

type PartStatus = 'locked' | 'available' | 'completed';

const HuntDetailsScreen: React.FC = () => {
    const router = useRouter();
    const { id, culturalCenterId, from } = useLocalSearchParams();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language] as {
        backToCulturalCenter?: string;
        backToMenu?: string;
        stepsTitle: string;
        noSteps: string;
        startHunt: string;
        resumeHunt?: string;
        completedHuntMessage?: string;
        partLabel: string;
        lockedPartMessage: string;
    };
    const { isConnected } = useAuth();

    // Handle cases where parameters might be undefined
    const huntId = Array.isArray(id) ? id[0] : id;
    const centerId = Array.isArray(culturalCenterId) ? culturalCenterId[0] : culturalCenterId;
    const fromScreen = Array.isArray(from) ? from[0] : from;

    const [steps, setSteps] = useState<LightStepDTO[]>([]);
    const [progression, setProgression] = useState<ProgressionByHunt | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getStepByHunt(huntId)
            setSteps(Array.isArray(data) ? data : [])

            if (isConnected && huntId) {
                const progressionData = await getProgressionByHunt(huntId);
                setProgression(progressionData ?? null);
            } else {
                setProgression(null);
            }
        }
        if (huntId != null && huntId != "") {
            fetchData()
        }
    }, [huntId, isConnected])

    const groupedSteps = steps.reduce((acc: GroupedSteps[], step) => {
        const indexNumber = step.index_number ?? 1;
        const existingGroup = acc.find((group) => group.indexNumber === indexNumber);

        if (existingGroup) {
            existingGroup.steps.push(step);
        } else {
            acc.push({ indexNumber, steps: [step] });
        }

        return acc;
    }, []).sort((a, b) => a.indexNumber - b.indexNumber);

    const isPartUnlocked = (indexNumber: number) => {
        if (!isConnected) {
            return indexNumber === 1;
        }

        if (!progression) {
            return indexNumber === 1;
        }

        if (progression.isComplete) {
            return true;
        }

        return indexNumber <= (progression.current_index?.index ?? 1);
    };

    const isStepCompleted = (step: LightStepDTO, indexNumber: number) => {
        if (!isConnected || !progression) {
            return false;
        }

        if (progression.isComplete) {
            return true;
        }

        const currentIndex = progression.current_index?.index ?? 1;

        if (indexNumber < currentIndex) {
            return true;
        }

        if (indexNumber > currentIndex) {
            return false;
        }

        const remainingIds = new Set((progression.current_index?.remaining_steps ?? []).map((remaining) => remaining.id));
        return !remainingIds.has(step.id);
    };

    const getPartStatus = (group: GroupedSteps): PartStatus => {
        const isCompleted = group.steps.every((step) => isStepCompleted(step, group.indexNumber));

        if (isCompleted) {
            return 'completed';
        }

        if (isPartUnlocked(group.indexNumber)) {
            return 'available';
        }

        return 'locked';
    };

    const firstUnlockedStep = groupedSteps
        .find((group) => isPartUnlocked(group.indexNumber))
        ?.steps?.[0];

    const firstPendingStep = groupedSteps
        .flatMap((group) => group.steps.map((step) => ({ step, indexNumber: group.indexNumber })))
        .find(({ step, indexNumber }) => !isStepCompleted(step, indexNumber))
        ?.step;

    const completedStepsCount = groupedSteps
        .flatMap((group) => group.steps.map((step) => ({ step, indexNumber: group.indexNumber })))
        .filter(({ step, indexNumber }) => isStepCompleted(step, indexNumber)).length;

    const hasProgression = isConnected && completedStepsCount > 0;
    const targetStep = firstPendingStep ?? firstUnlockedStep;
    const totalHuntPoints = steps.reduce((sum, step) => sum + (step.points ?? 0), 0);
    const isHuntCompleted = isConnected && Boolean(progression?.isComplete || (steps.length > 0 && completedStepsCount >= steps.length));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.COLORS.background }}>
            <HeaderNavbar />
            <ScrollView contentContainerStyle={{ paddingHorizontal: theme.SPACING.large, paddingTop: theme.SPACING.medium, paddingBottom: theme.SPACING.xLarge }}>
                {/* Back Button */}
                <View style={{ alignItems: 'flex-start', marginBottom: theme.SPACING.small }}>
                    <TouchableOpacity
                        style={[theme.BUTTON_STYLES.default, { flexDirection: 'row', gap: theme.SPACING.medium, justifyContent: 'flex-start' }]}
                        onPress={() => {
                            if (centerId) {
                                router.replace({
                                    pathname: '/cultural-center',
                                    params: { id: centerId },
                                });
                                return;
                            }

                            if (fromScreen === 'hunt') {
                                router.replace('/hunt');
                                return;
                            }

                            router.back();
                        }}
                    >
                        <Ionicons name="arrow-back" size={24} color={theme.COLORS.icon} />
                        <Text style={[globalStyles.text, { color: theme.COLORS.icon, fontWeight: '500', fontSize: 20 }]}>{texts.backToCulturalCenter ?? texts.backToMenu ?? texts.backToMenu}</Text>
                    </TouchableOpacity>
                </View>

                {/* Steps List */}
                <View style={{ marginTop: theme.SPACING.small, backgroundColor: theme.COLORS.background, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 5, padding: theme.SPACING.medium, borderRadius: theme.SPACING.medium }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small, marginBottom: theme.SPACING.medium }}>
                        <SvgUri uri={getIconUri("step.svg")} width={37} height={37} color={theme.COLORS.tertiary} />
                        <Text style={[globalStyles.subtitle]}>{texts.stepsTitle} ({steps.length})</Text>
                    </View>
                    {groupedSteps.length > 0 ? (
                        groupedSteps.map((group) => {
                            const partStatus = getPartStatus(group);
                            const unlocked = partStatus !== 'locked';

                            const partContent = (
                                <View
                                    style={{
                                        backgroundColor: theme.COLORS.background,
                                        borderRadius: 5,
                                        padding: theme.SPACING.small,
                                        opacity: unlocked ? 1 : 0.85,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.SPACING.small, paddingVertical: theme.SPACING.small }}>
                                        <Text style={[globalStyles.text, { fontWeight: '700', fontSize: theme.FONT_SIZES.subtitle }]}>
                                            {texts.partLabel} {group.indexNumber}
                                        </Text>

                                        {partStatus === 'completed' ? (
                                            <View style={{ backgroundColor: '#2eb85c', borderRadius: 999, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                                                <SvgUri uri={getIconUri('check.svg')} width={12} height={12} color={theme.COLORS.background} />
                                            </View>
                                        ) : partStatus === 'locked' ? (
                                            <SvgUri uri={getIconUri('lock.svg')} width={20} height={20} color={theme.COLORS.textSecondary} />
                                        ) : null}
                                    </View>

                                    {group.steps.map((step, stepIndex) => {
                                        const stepCompleted = isStepCompleted(step, group.indexNumber);

                                        return (
                                            <View
                                                key={step.id}
                                                style={{
                                                    flexDirection: 'row',
                                                    backgroundColor: unlocked ? theme.COLORS.background : '#f5f5f5',
                                                    padding: theme.SPACING.medium,
                                                    borderRadius: theme.SPACING.small,
                                                    marginBottom: theme.SPACING.small,
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: unlocked ? 0.1 : 0,
                                                    shadowRadius: 4,
                                                    elevation: unlocked ? 2 : 0,
                                                }}
                                            >
                                                <View style={{ backgroundColor: unlocked ? theme.COLORS.primary : '#9f9f9f', borderRadius: 500, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: theme.SPACING.small }}>
                                                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: theme.FONT_SIZES.text }}>{stepIndex + 1}</Text>
                                                </View>

                                                <View style={{ flex: 1 }}>
                                                    <Text style={[globalStyles.text, { fontWeight: 'bold', paddingRight: theme.SPACING.medium }]}>{step.title}</Text>
                                                    <Text style={[globalStyles.text, { color: theme.COLORS.textSecondary, paddingRight: theme.SPACING.medium }]}>
                                                        {unlocked ? step.description : texts.lockedPartMessage}
                                                    </Text>
                                                </View>

                                                <View style={{ flexDirection: 'row', gap: theme.SPACING.small, alignItems: 'center' }}>
                                                    {stepCompleted ? (
                                                        <View style={{ backgroundColor: '#2eb85c', borderRadius: 999, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                                            <SvgUri uri={getIconUri('check.svg')} width={11} height={11} color={theme.COLORS.background} />
                                                        </View>
                                                    ) : unlocked ? (
                                                        <>
                                                            <Text style={{ fontWeight: '700', fontSize: theme.FONT_SIZES.text }}>+ {step.points}</Text>
                                                            <SvgUri uri={getIconUri("star.svg")} width={20} height={20} color={theme.COLORS.secondary} />
                                                        </>
                                                    ) : (
                                                        <SvgUri uri={getIconUri('lock.svg')} width={16} height={16} color={theme.COLORS.textSecondary} />
                                                    )}
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            );

                            return (
                                <View key={`part-${group.indexNumber}`} style={{ marginBottom: theme.SPACING.medium }}>
                                    {unlocked ? (
                                        <LinearGradient
                                            colors={[theme.COLORS.primary, theme.COLORS.secondary]}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={{ borderRadius: theme.SPACING.small, padding: 3 }}
                                        >
                                            {partContent}
                                        </LinearGradient>
                                    ) : (
                                        <View
                                            style={{
                                                borderRadius: theme.SPACING.small,
                                                borderWidth: 1,
                                                borderColor: '#d9d9d9',
                                                padding: 1,
                                            }}
                                        >
                                            {partContent}
                                        </View>
                                    )}
                                </View>
                            );
                        })
                    ) : (
                        <Text style={globalStyles.text}>{texts.noSteps}</Text>
                    )}
                </View>

                {isHuntCompleted ? (
                    <View
                        style={{
                            width: '100%',
                            marginTop: theme.SPACING.medium,
                            borderRadius: theme.SPACING.medium,
                            borderWidth: 1,
                            borderColor: `${theme.COLORS.secondary}55`,
                            backgroundColor: `${theme.COLORS.secondary}22`,
                            padding: theme.SPACING.medium,
                        }}
                    >
                        <Text style={[globalStyles.text, { fontWeight: '700', marginBottom: theme.SPACING.small }]}> 
                            {texts.completedHuntMessage}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.SPACING.small }}>
                            <Text style={[globalStyles.subtitle, { fontSize: theme.FONT_SIZES.text }]}>{totalHuntPoints}</Text>
                            <SvgUri uri={getIconUri('star.svg')} width={20} height={20} color={theme.COLORS.secondary} />
                        </View>
                    </View>
                ) : (
                    <TouchableOpacity
                        style={{ width: '100%', marginTop: theme.SPACING.medium }}
                        onPress={() => {
                            if (targetStep && huntId) {
                                router.push({
                                    pathname: '/current-step',
                                    params: {
                                        huntId,
                                        stepId: targetStep.id,
                                        culturalCenterId: centerId,
                                        from: fromScreen,
                                    },
                                });
                            }
                        }}
                    >
                        <LinearGradient colors={[theme.COLORS.primary, theme.COLORS.secondary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[theme.BUTTON_STYLES.default, { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: theme.SPACING.small, height: 50 }]} >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: theme.SPACING.small }}>
                                <SvgUri uri={getIconUri("play-button.svg")} width={20} height={20} color={theme.COLORS.background} />
                                <Text style={[{ fontSize: theme.FONT_SIZES.text, color: theme.COLORS.background, fontWeight: '700' }]}>{hasProgression ? (texts.resumeHunt ?? texts.startHunt) : texts.startHunt}</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}
            </ScrollView>
            <BottomNavbar />
        </SafeAreaView>
    );
};

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.huntDetails,
    fr: translationsFr.huntDetails
};

export default HuntDetailsScreen;