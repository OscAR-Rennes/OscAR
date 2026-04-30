import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, KeyboardAvoidingView, View } from 'react-native';
import { theme } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import PageTitle from '../../components/page-title';
import { useLanguage } from '../../context/LanguageContext';
import translations from '../../constants/language-en.json';
import translationsFr from '../../constants/language-fr.json';
import HuntSection from '../../components/hunt-section';
import { getTotalProgression } from '../../api/services/progression.api';
import { getHuntById } from '../../api/services/hunt.api';
import { useRouter } from 'expo-router';
import { HuntSectionItem } from '../../common/dto/IHuntSectionProps';

type ProgressionItem = {
    hunt_id: string;
    isComplete: boolean;
    completed_steps?: number;
    total_steps?: number;
    completed_points?: number;
    total_points?: number;
    total_indexes?: number;
    current_index?: {
        index: number;
    };
};

type HuntDetailsResponse = {
    id: string;
    title?: string;
    points?: number;
    steps?: Array<{ id: string; title: string }> | number;
    culturalCenter?: {
        name?: string;
    };
};

export default function HuntScreen() {
    const { isConnected } = useAuth();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];
    const huntListTexts = HUNT_LIST_TEXTS[language];
    const huntDetailsTexts = HUNT_DETAILS_TEXTS[language];
    const router = useRouter();

    const [currentHunts, setCurrentHunts] = useState<HuntSectionItem[]>([]);
    const [completedHunts, setCompletedHunts] = useState<HuntSectionItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProgression = async () => {
            if (!isConnected) {
                setCurrentHunts([]);
                setCompletedHunts([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);

            try {
                const progressionResponse = await getTotalProgression();
                const progressionItems: ProgressionItem[] = Array.isArray(progressionResponse) ? progressionResponse : [];

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

                setCurrentHunts(
                    huntsWithTitles
                        .filter((hunt) => !hunt.isComplete)
                        .map(({ id, title, currentIndex, totalIndexes, completedPoints, totalPoints, completedSteps, totalSteps, culturalCenterName }) => ({
                            id,
                            title,
                            currentIndex,
                            totalIndexes,
                            completedPoints,
                            totalPoints,
                            completedSteps,
                            totalSteps,
                            culturalCenterName,
                        }))
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
            } catch {
                setCurrentHunts([]);
                setCompletedHunts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProgression();
    }, [isConnected]);

    const currentTitle = useMemo(
        () => texts.currentHuntsTitle.replace(/\(\d+\)/, `(${currentHunts.length})`),
        [texts.currentHuntsTitle, currentHunts.length]
    );

    const completedTitle = useMemo(
        () => texts.completedHuntsTitle.replace(/\(\d+\)/, `(${completedHunts.length})`),
        [texts.completedHuntsTitle, completedHunts.length]
    );

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: theme.SPACING.large }}>
                {/* Current Hunts Section */}
                <View style={{ marginBottom: theme.SPACING.small, marginTop: theme.SPACING.large, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: theme.SPACING.small, padding: theme.SPACING.medium }}>
                    <HuntSection
                        title={currentTitle}
                        icon="target-larger.svg"
                        iconColor={theme.COLORS.primary}
                        placeholderIcon="target-larger.svg"
                        placeholderMessage={isConnected ? texts.currentHuntsPlaceholderMessage : texts.disconnectedPlaceholderMessage}
                        buttonText={texts.connectButtonText}
                        isAuthenticated={isConnected}
                        authMessage={isLoading ? texts.currentHuntsAuthMessage : texts.currentHuntsPlaceholderMessage}
                        pointsLabel={huntListTexts.points}
                        stepsLabel={huntListTexts.steps}
                        partLabel={huntDetailsTexts.partLabel}
                        hunts={currentHunts}
                        isLoading={isLoading}
                        onHuntPress={(hunt) =>
                            router.push({
                                pathname: '/hunt-details',
                                params: { id: hunt.id, from: 'hunt' },
                            })
                        }
                    />
                </View>

                {/* Completed Hunts Section */}
                <View style={{ marginBottom: theme.SPACING.large, marginTop: theme.SPACING.small, borderWidth: 1, borderColor: '#e0e0e0', borderRadius: theme.SPACING.small, padding: theme.SPACING.medium }}>
                    <HuntSection
                        title={completedTitle}
                        icon="check.svg"
                        iconColor={theme.COLORS.success}
                        placeholderIcon="target-larger.svg"
                        placeholderMessage={isConnected ? texts.completedHuntsPlaceholderMessage : texts.disconnectedPlaceholderMessage}
                        buttonText={texts.connectButtonText}
                        isAuthenticated={isConnected}
                        authMessage={isLoading ? texts.completedHuntsAuthMessage : texts.completedHuntsPlaceholderMessage}
                        pointsLabel={huntListTexts.points}
                        stepsLabel={huntListTexts.steps}
                        partLabel={huntDetailsTexts.partLabel}
                        hunts={completedHunts}
                        isLoading={isLoading}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

// Translations of static texts
const STATIC_TEXTS = {
    en: translations.hunt,
    fr: translationsFr.hunt
};

const HUNT_LIST_TEXTS = {
    en: translations.huntList,
    fr: translationsFr.huntList,
};

const HUNT_DETAILS_TEXTS = {
    en: translations.huntDetails,
    fr: translationsFr.huntDetails,
};