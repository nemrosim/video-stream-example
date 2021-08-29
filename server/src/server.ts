import express from 'express';
import cors from 'cors';
import * as fs from 'fs';
import path from 'path';
import { getChunkProps, getFileSizeAndResolvedPath } from './utils';

const app = express();
app.use(cors());

const VIDEO_FILE_PATH = 'assets/unreal-engine-5-demo.mp4';

app.get('/video-file', (req, res) => {
    const resolvedPath = path.resolve(VIDEO_FILE_PATH);
    res.sendFile(resolvedPath);
});

// This is a common approach
app.get('/video-chunk', (request, response) => {
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

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
});
