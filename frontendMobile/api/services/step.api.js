import { apiClient } from '../apiClient';
import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';
import { unzipSync } from 'fflate';
import { Buffer } from 'buffer'
import {
    normalizeFilename,
    normalizeMtl,
    isMtlFile,
} from '@/common/utils/normalizeFiles';

export function getStepsByCulturalCenter() {
  return apiClient(`/step/culturalcenter`);
}

export function getStepById(stepId) {
  return apiClient(`/step/getById/${stepId}`);
}

export function getStepByHunt(huntId) {
  return apiClient(`/step/getByHunt/${huntId}`)
}

export async function downloadStepTarget(stepId){
    const token = await SecureStore.getItemAsync("token");
    const destPath = `${FileSystem.cacheDirectory}target_${stepId}.jpg`;
    
    const result = await FileSystem.downloadAsync(
        `http://192.168.1.119:5000/api/step/downloadTarget/${stepId}`,
        destPath,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return result.uri;
}

export async function downloadStepArFiles(stepId) {

    const token = await SecureStore.getItemAsync("token");
    const zipPath = `${FileSystem.cacheDirectory}ar_${stepId}.zip`;
    const extractPath = `${FileSystem.cacheDirectory}ar_${stepId}/`;

    try {
        await FileSystem.deleteAsync(zipPath, { idempotent: true });

        await FileSystem.deleteAsync(extractPath, {
            idempotent: true,
        });

    } catch {}

    await FileSystem.downloadAsync(
        `http://192.168.1.119:5000/api/step/downloadAr/${stepId}`,
        zipPath,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const base64 = await FileSystem.readAsStringAsync(zipPath, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const binary = Buffer.from(base64, 'base64');
    const unzipped = unzipSync(new Uint8Array(binary));

    await FileSystem.makeDirectoryAsync(extractPath, {
        intermediates: true,
    });

    for (const [filename, data] of Object.entries(unzipped)) {

        if (!data || filename.endsWith('/')) continue;

        const normalizedFilename = normalizeFilename(filename);

        const filePath = extractPath + normalizedFilename;

        const dirPath = filePath.substring(
            0,
            filePath.lastIndexOf('/')
        );

        await FileSystem.makeDirectoryAsync(dirPath, {
            intermediates: true,
        });

        if (isMtlFile(normalizedFilename)) {

            const raw = Buffer.from(data).toString('utf-8');
            const content = normalizeMtl(raw);

            await FileSystem.writeAsStringAsync(
                filePath,
                content,
                {
                    encoding: FileSystem.EncodingType.UTF8,
                }
            );

        } else {

            await FileSystem.writeAsStringAsync(
                filePath,
                Buffer.from(data).toString('base64'),
                {encoding: FileSystem.EncodingType.Base64}
            );
        }
    }

    return extractPath;
}