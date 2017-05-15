Scramjet HTTP UriStream
-------------------------

A simple HTTP server providing a stream of HTTP URI's sent to it. Clients always receive a `204 No content` status.

## API

The module exposes the following methods:

### scHTTP.uri

`scHTTP.uri([scramjet, ]server)` - a stream of uri strings of all requests made to the server (except for OPTIONS)

Arguments:

* `server` - your HTTP server

### scHTTP.request

`scHTTP.request([scramjet, ]server)` - a stream of all request objects from requests made to the server (except for OPTIONS)

Arguments:

* `server` - your HTTP server

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

As of version 2.0 Scramjet is MIT Licensed and as of 1.0.0 so is this module.
