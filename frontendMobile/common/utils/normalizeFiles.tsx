import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';

export function normalizeFilename(filename: string) {
    return filename.replace(/\\/g, '/');
}

export function isMtlFile(filename: string) {
    return filename.toLowerCase().endsWith('.mtl');
}

export function isBinaryFile(filename: string) {
    return (
        filename.toLowerCase().match(/\.(jpg|jpeg|png|webp|bin)$/) !== null
    );
}

export function normalizeMtl(content: string) {
    return content
        .replace(/\\/g, '/')
        .split('\n')
        .filter(line => {
            const l = line.trim();

            // keep only Viro-safe MTL instructions
            return (
                l.startsWith('newmtl') ||
                l.startsWith('Ka ') ||
                l.startsWith('Kd ') ||
                l.startsWith('Ks ') ||
                l.startsWith('d ') ||
                l.startsWith('illum ') ||
                l.startsWith('map_Kd ')
            );
        })
        .map(line => {
            if (line.startsWith('illum')) return 'illum 1';
            if (line.startsWith('Ks')) return 'Ks 0 0 0';
            return line;
        })
        .join('\n');
}