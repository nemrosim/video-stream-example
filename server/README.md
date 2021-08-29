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
