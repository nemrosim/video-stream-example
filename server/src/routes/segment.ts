import path from 'path';
import express from 'express';

const router = express.Router();

/**
 * This route will return an .m3u8 file with all video file segments info
 * If you don't have any files in /segments folder -> run "generate.mjs" file:
 * it will create a m3u8 list with segmented videos.
 */
router.get('/segments-list', (request, response) => {
    const resolvedPath = path.resolve('assets/segments/output.m3u8');
    response.sendFile(resolvedPath);
});

/**
 * Will return specific video segment, like "file149.ts" from the /segments folder
 */
router.get('/segments/:segment', (request, response) => {
    const { segment } = request.params;
    const resolvedPath = path.resolve(`assets/segments/${segment}`);
    response.sendFile(resolvedPath);
});

export default router;
