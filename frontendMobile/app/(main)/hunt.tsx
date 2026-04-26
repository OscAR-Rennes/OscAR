import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
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
    current_index?: {
        index: number;
    };
};

export default function HuntScreen() {
    const { isConnected } = useAuth();
    const { language } = useLanguage();
    const texts = STATIC_TEXTS[language];
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
                        const hunt = await getHuntById(item.hunt_id);
                        return {
                            id: item.hunt_id,
                            title: hunt?.title ?? item.hunt_id,
                            currentIndex: item.current_index?.index,
                            isComplete: item.isComplete,
                        };
                    })
                );

                setCurrentHunts(
                    huntsWithTitles
                        .filter((hunt) => !hunt.isComplete)
                        .map(({ id, title, currentIndex }) => ({ id, title, currentIndex }))
                );

                setCompletedHunts(
                    huntsWithTitles
                        .filter((hunt) => hunt.isComplete)
                        .map(({ id, title }) => ({ id, title }))
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
                <PageTitle title={texts.pageTitle} />
                
                {/* Current Hunts Section */}
                <HuntSection
                    title={currentTitle}
                    icon="target-larger.svg"
                    iconColor={theme.COLORS.primary}
                    placeholderIcon="target-larger.svg"
                    placeholderMessage={isConnected ? texts.currentHuntsPlaceholderMessage : texts.disconnectedPlaceholderMessage}
                    buttonText={texts.connectButtonText}
                    isAuthenticated={isConnected}
                    authMessage={isLoading ? texts.currentHuntsAuthMessage : texts.currentHuntsPlaceholderMessage}
                    hunts={currentHunts}
                    isLoading={isLoading}
                    onHuntPress={(hunt) =>
                        router.push({
                            pathname: '/hunt-details',
                            params: { id: hunt.id, from: 'hunt' },
                        })
                    }
                />

                {/* Completed Hunts Section */}
                <HuntSection
                    title={completedTitle}
                    icon="check.svg"
                    iconColor={theme.COLORS.success}
                    placeholderIcon="target-larger.svg"
                    placeholderMessage={isConnected ? texts.completedHuntsPlaceholderMessage : texts.disconnectedPlaceholderMessage}
                    buttonText={texts.connectButtonText}
                    isAuthenticated={isConnected}
                    authMessage={isLoading ? texts.completedHuntsAuthMessage : texts.completedHuntsPlaceholderMessage}
                    hunts={completedHunts}
                    isLoading={isLoading}
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