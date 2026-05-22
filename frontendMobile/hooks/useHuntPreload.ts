import { useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { LightStepDTO } from '../common/dto/ILightStep';
import { downloadStepArFiles, downloadStepTarget } from '@/api/services/step.api';
import { FullStepDTO } from '@/common/dto/IStep';

export type CachedStepFiles = {
    stepId: string;
    targetUri: string;
    arDir: string;
    stepData?: FullStepDTO;
};
    
const getCacheDir = (huntId: string) =>
    `${FileSystem.cacheDirectory}hunt-${huntId}/`;

const getStepCacheDir = (huntId: string, stepId: string) =>
    `${getCacheDir(huntId)}step-${stepId}/`;

export const useHuntPreload = () => {
    const [isPreloading, setIsPreloading] = useState(false);
    const [preloadProgress, setPreloadProgress] = useState(0);
    const [cachedFiles, setCachedFiles] = useState<Map<string, CachedStepFiles>>(new Map());
    const [preloadError, setPreloadError] = useState<string | null>(null);

    const isStepCached = async (huntId: string, stepId: string): Promise<boolean> => {
        const dir = getStepCacheDir(huntId, stepId);
        try {
            const info = await FileSystem.getInfoAsync(`${dir}target`);
            return info.exists;
        } catch {
            return false;
        }
    };

    const cacheStep = async (huntId: string, step: LightStepDTO, stepData?: FullStepDTO): Promise<CachedStepFiles | null> => {
        const dir = getStepCacheDir(huntId, step.id);

        try {
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

            const [targetUri, arDir] = await Promise.all([
                downloadStepTarget(step.id),
                downloadStepArFiles(step.id),
            ]);

            const targetDest = `${dir}target`;
            await FileSystem.copyAsync({ from: targetUri, to: targetDest });

            const arFiles = await FileSystem.readDirectoryAsync(arDir);
            await Promise.all(
                arFiles.map(filename =>
                    FileSystem.copyAsync({
                        from: arDir + filename,
                        to: dir + filename,
                    })
                )
            );

            return {
                stepId: step.id,
                targetUri: targetDest,
                arDir: dir,
                stepData,
            };
        } catch (err) {
            console.warn(`[HuntPreload] Failed to cache step ${step.id}:`, err);
            return null;
        }
    };

    const preloadHunt = useCallback(async (
        huntId: string,
        steps: LightStepDTO[],
        fetchFullStep?: (id: string) => Promise<FullStepDTO>
    ) => {
        if (steps.length === 0) return;

        setIsPreloading(true);
        setPreloadProgress(0);
        setPreloadError(null);

        const newCache = new Map<string, CachedStepFiles>();
        let completed = 0;

        for (const step of steps) {
            const alreadyCached = await isStepCached(huntId, step.id);
            if (alreadyCached) {
                const dir = getStepCacheDir(huntId, step.id);
                const stepData = fetchFullStep ? await fetchFullStep(step.id) : undefined;
                newCache.set(step.id, {
                    stepId: step.id,
                    targetUri: `${dir}target`,
                    arDir: dir,
                    stepData,
                });
                completed++;
                setPreloadProgress(completed / steps.length);
                continue;
            }

            const cached = await cacheStep(huntId, step, fetchFullStep ? await fetchFullStep(step.id) : undefined);
            if (cached) newCache.set(step.id, cached);

            completed++;
            setPreloadProgress(completed / steps.length);
        }

        setCachedFiles(newCache);
        setIsPreloading(false);

        if (newCache.size < steps.length) {
            setPreloadError(`${steps.length - newCache.size} étape(s) n'ont pas pu être téléchargées`);
        }
    }, []);

    const getCachedStep = (stepId: string): CachedStepFiles | null =>
        cachedFiles.get(stepId) ?? null;

    const clearHuntCache = async (huntId: string) => {
        const dir = getCacheDir(huntId);
        try {
            await FileSystem.deleteAsync(dir, { idempotent: true });
            setCachedFiles(new Map());
        } catch (err) {
            console.warn('[HuntPreload] Failed to clear cache:', err);
        }
    };

    return {
        isPreloading,
        preloadProgress,
        preloadError,
        preloadHunt,
        getCachedStep,
        clearHuntCache,
    };
};