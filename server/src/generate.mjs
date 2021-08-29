import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import * as path from "path";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const UNREAL_FILE_PATH = '../assets/unreal-engine-5-demo.mp4';

const resolvedPath = path.resolve(UNREAL_FILE_PATH);

/**
 * Docs:
 * https://www.npmjs.com/package/fluent-ffmpeg
 * https://ffmpeg.org/ffmpeg-formats.html#hls
 */
const command = ffmpeg(resolvedPath, { timeout: 432000 })
    .addOption([
        '-profile:v baseline',
        '-f segment',
        '-level 3.0',
        '-start_number 0',
        '-hls_base_url segments/',
        '-hls_segment_filename ../assets/segments/file%03d.ts',
        // Apple recommended time = 6,
        // In seconds
        '-hls_time 6',
        '-hls_list_size 0',
        // format
        '-f hls',
    ])
    .output('../assets/segments/output.m3u8')
    .on('end', (stdout, stderr) => {
        console.log('Transcoding succeeded !');
        process.exit(1);
    })
    .on('start', (commandLine) => {
        console.log('start', commandLine);
    })
    .on('codecData', (data) => {
        console.log('Input is ' + data.audio + ' audio ' +
            'with ' + data.video + ' video');
    })
    .on('progress', function (progress) {
        console.log('Processing. Timemark: -> ' + progress.timemark)
    })
    .on('stderr', function (stderrLine) {
        // do nothing
    })
    .on('error', function (err, stdout, stderr) {
        console.log('Cannot process video: ' + err.message);
    })
    .on('data', function (chunk) {
        console.log('ffmpeg just wrote ' + chunk.length + ' bytes');
    });

command.run();
