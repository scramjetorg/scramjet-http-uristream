const http = require("http");
const querystring = require("querystring");
const EventEmitter = require("events").EventEmitter;
const API_VERSION = 1;

const getScramjetVersion = (scramjet) => {
    if (!(scramjet = scramjet.API(API_VERSION)))
        throw new Error("Scramjet API version " + API_VERSION + " required!");

    return scramjet;
};

const makeServer = (callback, scramjet, server) => {
    if (scramjet instanceof http.Server) {
        [scramjet, server] = [require("scramjet"), scramjet];
    }

    var stream = new (getScramjetVersion(scramjet).DataStream)();
    server.on("request", (req, res) => {
        // Set CORS headers
    	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || "*");
    	res.setHeader('Access-Control-Request-Method', '*');
    	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    	res.setHeader('Access-Control-Allow-Headers', '*');

    	if (req.method === 'OPTIONS') {
    		res.writeHead(200);
    		return res.end();
    	}

        res.writeHead(204, "No content");
        res.end();

        process.nextTick(() => callback(stream, req));
    });
    return stream;
};

module.exports = makeServer;
module.exports.debug = () => {};
module.exports.uri = makeServer.bind(null, (stream, req) => stream.write(req.url));
module.exports.request = makeServer.bind(null, (stream, req) => stream.write(req));
