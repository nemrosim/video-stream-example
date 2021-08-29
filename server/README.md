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
