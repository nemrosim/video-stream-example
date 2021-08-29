import express from 'express';
import path from 'path';
import { VIDEO_FILE_PATH } from '../constants';

const router = express.Router();

/**
 * Send a simple video file
 */
router.get('/video-file', (request, response) => {
    const resolvedPath = path.resolve(VIDEO_FILE_PATH);
    response.sendFile(resolvedPath);
});

export default router;
