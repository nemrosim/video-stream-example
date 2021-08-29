### Binary

```typescript
app.post('/file', (request, response) => {
    let data = new Buffer('');
    request.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
    });
    request.on('end', () => {
        response.send(data);
    });
})
```

# `__dirname`

```ts
app.get('/some-path', (req, res) => {
    /**
     * "__dirname" is a global object
     * You can check more here:
     * https://nodejs.org/docs/latest-v14.x/api/globals.html#globals_global_objects
     * https://nodejs.org/docs/latest-v14.x/api/modules.html#modules_dirname
     */
    const root = __dirname;

    /**
     * If call it in "src/server.ts" file
     * will return "/Users/{username}/{path}/video-stream-example/server/src"
     */
    console.log(root)

})
```

# File stream

```ts
const getChunkProps = (range: string, fileSize: number) => {
    const parts = range.replace(/bytes=/, '').split('-');

    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;

    return {
        start,
        end,
        chunksize,
    };
};
// This is a common approach
app.get('/video-chunk', (request, response) => {
    const resolvedPath = path.resolve(VIDEO_FILE_PATH);

    /*
        To check if a file exists without manipulating it afterwards, fs.access() is recommended.
        This function will return a fs.Stats object
        A fs.Stats object provides information about a file.
     */
    const stat = fs.statSync(resolvedPath);

    // One of values -> full file size
    const fileSize = stat.size;

    // If we are requesting file for a first time
    // this header will not be included
    const range = request.headers.range;

    if (range) {
        /*
         Example of range:
         bytes=0-
         bytes=5570560-
         bytes=12041304-
         bytes=32766200-
         bytes=40433912-
         bytes=48101624-
         bytes=50657528-
         bytes=56817912-
         bytes=60946680-
         bytes=65534200-
         bytes=67982672-
         */

        const {start, end, chunksize} = getChunkProps(range, fileSize);

        /*
            options can include "start" and "end" values to read a range of bytes
             from the file instead of the entire file.
         */
        const readStream = fs.createReadStream(resolvedPath, {start, end});

        /*
            The HTTP 206 Partial Content success status response code
            indicates that the request has succeeded and the body contains the requested ranges of data,
            as described in the Range header of the request.
         */
        response.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        });
        /*
        The readable.pipe() method attaches a Writable stream to the readable,
         causing it to switch automatically into flowing mode and push all of its data
          to the attached Writable. The flow of data will be automatically managed
           so that the destination Writable stream is not overwhelmed
            by a faster Readable stream.
         */
        readStream.pipe(response);
    } else {
        response.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        });
        fs.createReadStream(resolvedPath).pipe(response);
    }
});
```

# Dynamic segment

```ts
router.get('/dynamic-segment', (request, response) => {
    const stream = fs.createReadStream(VIDEO_FILE_PATH);

    const command = ffmpeg(stream, {
        timeout: 1000,
    })
        .format('flv')
        .on('progress', function (progress) {
            console.log('Processing. Timemark: -> ' + progress.timemark);
        })
        .on('end', (stdout, stderr) => {
            console.log('Transcoding succeeded !');
        })
        .on('error', (error) => {
            console.log('error', error);
        });

    const ffstream = command.pipe();
    ffstream.on('data', function (chunk) {
        response.send(chunk);
    });

    command.run();
});
```
