# Sample Chat Backend

### Quick start

- `npm start` to run the project in development mode
- `npm run build && node dist/src/main` to run the project in production mode (or just use a [pre-built Docker image](https://github.com/goooseman/sample-chat-backend/packages?package_type=Docker))

### API

A server has the following API.

##### Send message

```typescript
const content: {
  id: string;
  userId: string;
  text: string;
  username: string;
  createdAt: string; // ISO 8601
  status: "none";
} = { ... };
await chatIO.emit("message", content, cb);
```

##### List messages

```typescript
const Content: {
  id: string;
  userId: string;
  text: string;
  username: string;
  createdAt: string; // ISO 8601
  status: "none";
} = { ... };
await chatIO.emit("listMessages", (err?: Error, data: { items: Content[]} ) => { ... });
```

##### Recieve message

```typescript
const Content: {
  id: string;
  userId: string;
  text: string;
  username: string;
  createdAt: string; // ISO 8601
  status: "none";
} = { ... };
chatIO.on("message", (data: Content) => { ... });
```

### TODO

- [ ] Pagination
- [ ] Authorization
- [ ] Seen marks
