## Usage

A simple http tracking server with separated paths for some requests

```javascript
    const scramjet = require("scramjet");
    const server = require("http").createServer();
    const scUri = require("scramjet-http-uristream");

    scHTTP.uri(scramjet, server)
        .map((item) => {
            const ret = url.parse(item, true);
            ret.ts = Date.now();
        })
        .filter((url) => url.pathname.indexOf("/track") >= 0)
        .map((item) => item.query)
        .tee(
            (stream) => stream
                .filter((item) => item.t === "imp")
                .on("data", (item) => console.log("IMP", item))
        )
        .on("data", (item) => console.log("ALL", item))
        .on("error", (err) => console.log(err && err.stack));

    server.listen(8080);
```

## License and contributions

At this moment Scramjet is released under the terms of GPL-3.
