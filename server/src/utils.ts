import path from 'path';
import fs from 'fs';

export const getChunkProps = (range: string, fileSize: number) => {
    const parts = range.replace(/bytes=/, '').split('-');

    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    return {
        start,
        end,
        chunkSize,
    };
};

export const getFileSizeAndResolvedPath = (filePath: string) => {
    const resolvedPath = path.resolve(filePath);
    const stat = fs.statSync(resolvedPath);
    return { fileSize: stat.size, resolvedPath: resolvedPath };
};
