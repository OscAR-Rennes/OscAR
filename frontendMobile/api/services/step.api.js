import { apiClient } from '../apiClient';
import * as FileSystem from 'expo-file-system/legacy';
import * as SecureStore from 'expo-secure-store';
import { unzipSync } from 'fflate';
import { Buffer } from 'buffer'

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
        `http://192.168.1.11:5000/api/step/downloadTarget/${stepId}`,
        destPath,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return result.uri;
}

export async function downloadStepArFiles(stepId){
    
    const token = await SecureStore.getItemAsync("token");
    const zipPath = `${FileSystem.cacheDirectory}ar_${stepId}.zip`;
    const extractPath = `${FileSystem.cacheDirectory}ar_${stepId}/`;

    try {
        await FileSystem.deleteAsync(zipPath, { idempotent: true });
        await FileSystem.deleteAsync(extractPath, { idempotent: true });
    } catch {}

    await FileSystem.downloadAsync(
        `http://192.168.1.11:5000/api/step/downloadAr/${stepId}`,
        zipPath,
        { headers: { Authorization: `Bearer ${token}` } }
    );

    const base64 = await FileSystem.readAsStringAsync(zipPath, {
        encoding: FileSystem.EncodingType.Base64,
    });

    const binary = Buffer.from(base64, 'base64');
    const unzipped = unzipSync(new Uint8Array(binary));

    await FileSystem.makeDirectoryAsync(extractPath, { intermediates: true });

    for (const [filename, data] of Object.entries(unzipped)) {
        const filePath = extractPath + filename.split('/').pop();
        const fileBase64 = Buffer.from(data).toString('base64');
        await FileSystem.writeAsStringAsync(filePath, fileBase64, {
            encoding: FileSystem.EncodingType.Base64,
        });
    }

    const files = await FileSystem.readDirectoryAsync(extractPath);
    const obj = files.find(f => f.endsWith('.obj'));
    const mtl = files.find(f => f.endsWith('.mtl'));
    const jpg = files.find(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));

    const mtlContent = await FileSystem.readAsStringAsync(extractPath + 'model.mtl');

    const absoluteJpgPath = extractPath + jpg;
    const patchedMtl = mtlContent
        .replace(/map_\w+\s+.+/gi, (match) => {
            const mapType = match.split(/\s+/)[0];
            return `${mapType} ${absoluteJpgPath}`;
        });

    await FileSystem.writeAsStringAsync(extractPath + mtl, patchedMtl);

    return {
        obj: extractPath + obj,
        mtl: extractPath + mtl,
        jpg: extractPath + jpg,
    };
}