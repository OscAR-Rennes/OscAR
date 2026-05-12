import { useState, useCallback } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import { LightStepDTO } from '../common/dto/ILightStep';

import { downloadStepArFiles, downloadStepTarget } from '@/api/services/step.api';

export type CachedStepFiles = {
    stepId: string;
    targetUri: string;
    objUri: string;
    mtlUri: string;
    jpgUri: string;
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

    const cacheStep = async (
        huntId: string,
        step: LightStepDTO
    ): Promise<CachedStepFiles | null> => {
        const dir = getStepCacheDir(huntId, step.id);

        try {
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

            const [targetUri, arFiles] = await Promise.all([
                downloadStepTarget(step.id),
                downloadStepArFiles(step.id),
            ]);

            const targetDest = `${dir}target`;
            const objDest = `${dir}model.obj`;
            const mtlDest = `${dir}model.mtl`;
            const jpgDest = `${dir}texture.jpg`;

            await Promise.all([
                FileSystem.copyAsync({ from: targetUri, to: targetDest }),
                FileSystem.copyAsync({ from: arFiles.obj, to: objDest }),
                FileSystem.copyAsync({ from: arFiles.mtl, to: mtlDest }),
                FileSystem.copyAsync({ from: arFiles.jpg, to: jpgDest }),
            ]);

            return {
                stepId: step.id,
                targetUri: targetDest,
                objUri: objDest,
                mtlUri: mtlDest,
                jpgUri: jpgDest,
            };
        } catch (err) {
            console.warn(`[HuntPreload] Failed to cache step ${step.id}:`, err);
            return null;
        }
    };

    const preloadHunt = useCallback(async (huntId: string, steps: LightStepDTO[]) => {
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
                newCache.set(step.id, {
                    stepId: step.id,
                    targetUri: `${dir}target`,
                    objUri: `${dir}model.obj`,
                    mtlUri: `${dir}model.mtl`,
                    jpgUri: `${dir}texture.jpg`,
                });
                completed++;
                setPreloadProgress(completed / steps.length);
                continue;
            }

            const cached = await cacheStep(huntId, step);
            if (cached) {
                newCache.set(step.id, cached);
            }

            completed++;
            setPreloadProgress(completed / steps.length);
        }

        setCachedFiles(newCache);
        setIsPreloading(false);

        if (newCache.size < steps.length) {
            setPreloadError(
                `${steps.length - newCache.size} étape(s) n'ont pas pu être téléchargées`
            );
        }
    }, []);

    const getCachedStep = (stepId: string): CachedStepFiles | null => {
        return cachedFiles.get(stepId) ?? null;
    };

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
