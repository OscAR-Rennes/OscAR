
export function normalizeFilename(filename: string): string {
    return filename.split('/').filter(Boolean).pop() ?? filename;
}

export function isMtlFile(filename: string): boolean {
    return filename.toLowerCase().endsWith('.mtl');
}


export function normalizeMtl(content: string): string {
    return content.replace(
        /^(\s*map_\w+\s+)(.+)$/gim,
        (_, directive, texturePath) => {
            const filename = texturePath.trim().split(/[/\\]/).pop() ?? texturePath.trim();
            return `${directive}${filename}`;
        }
    );
}