import { getChunkProps, getFileSizeAndResolvedPath } from '../utils';
import fs from 'fs';
import express from 'express';
import { VIDEO_FILE_PATH } from '../constants';

const router = express.Router();

/**
 * Send video file in chunks
 * Common approach
 */
router.get('/video-chunk', (request, response) => {
    const { fileSize, resolvedPath } = getFileSizeAndResolvedPath(VIDEO_FILE_PATH);

    const requestRangeHeader = request.headers.range;

    if (!requestRangeHeader) {
        response.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        });
        // .pipe -> in a simple words it's like response.send() but for readStream
        fs.createReadStream(resolvedPath).pipe(response);
    } else {
        const { start, end, chunkSize } = getChunkProps(requestRangeHeader, fileSize);

        // Read only part of the file from "start" to "end"
        const readStream = fs.createReadStream(resolvedPath, { start, end });

        response.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': 'video/mp4',
        });
        readStream.pipe(response);
    }
});

export default router;
