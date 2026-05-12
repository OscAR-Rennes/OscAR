import AsyncStorage from '@react-native-async-storage/async-storage';

type RemainingStep = { id: string; title: string };

type LocalProgression = {
    hunt_id: string;
    isComplete: boolean;
    completedStepIds: string[];
    current_index?: {
        id: string;
        index: number;
        remaining_steps: RemainingStep[];
    };
};

const key = (huntId: string) => `progression:${huntId}`;

export const useLocalProgression = () => {

    const getProgression = async (huntId: string): Promise<LocalProgression | null> => {
        try {
            const raw = await AsyncStorage.getItem(key(huntId));
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    };

    const saveStepLocally = async (
        huntId: string,
        stepId: string,
        allSteps: { id: string; index_number?: number; title: string }[]
    ): Promise<LocalProgression> => {
        const existing = await getProgression(huntId) ?? {
            hunt_id: huntId,
            isComplete: false,
            completedStepIds: [],
        };

        const completedStepIds = Array.from(new Set([...existing.completedStepIds, stepId]));
        const isComplete = completedStepIds.length >= allSteps.length;

        const remainingSteps = allSteps.filter((s) => !completedStepIds.includes(s.id));
        const nextStep = remainingSteps[0];

        const updated: LocalProgression = {
            hunt_id: huntId,
            isComplete,
            completedStepIds,
            current_index: nextStep
                ? {
                      id: nextStep.id,
                      index: nextStep.index_number ?? 1,
                      remaining_steps: remainingSteps.map((s) => ({ id: s.id, title: s.title })),
                  }
                : undefined,
        };

        await AsyncStorage.setItem(key(huntId), JSON.stringify(updated));
        return updated;
    };

    const clearProgression = async (huntId: string) => {
        await AsyncStorage.removeItem(key(huntId));
    };

    const toServerFormat = (local: LocalProgression) => ({
        hunt_id: local.hunt_id,
        isComplete: local.isComplete,
        current_index: local.current_index,
    });

    return { getProgression, saveStepLocally, clearProgression, toServerFormat };
};
