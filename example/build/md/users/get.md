---
id:
slug: users-get
---

```
GET /users
```

**Returns a list of users.: **Optional extended description in CommonMark or HTML.

## Parameters

| name | in  | type | required | description |
| ---- | --- | ---- | -------- | ----------- |

## Code Snippets

```javascript title="Node + Native"
const http = require("http");

const options = {
  method: "GET",
  hostname: "api.example.com",
  port: null,
  path: "/v1/users",
  headers: {},
};

const req = http.request(options, function (res) {
  const chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();
```

## Responses

### 200

A JSON array of user names

| Headers      |                  |
| ------------ | ---------------- |
| content-type | application/json |

**Example `response` for `application/json`**

```json
["string"]
```
