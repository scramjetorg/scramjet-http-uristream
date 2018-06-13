const request = require("request-promise-native");
const scHTTP = require("../");
const querystring = require('querystring');

module.exports = {
    test_simple(test) {

        test.expect(1);

        const server = require("http").createServer();
        const stream = scHTTP.uri(server)
            .parse(x => querystring.parse(x.slice(x.indexOf('?') + 1)))
            .each(console.log)
            .filter((data) => (data && typeof data === "object" && !isNaN(+data.vote) && typeof data.for === "string"))
            .map((data) => ({
                contestant: data.for.substr(0, 1).toUpperCase(),
                vote: data.vote <= 256 && data.vote >= 0 && +data.vote || NaN
            }))
            .filter((nr) => !isNaN(nr.vote))
            .map((vote) => "F:" + vote.contestant + ",V:" + vote.vote.toString(16))
            .each(
                (voteString) => {
                    test.equals("F:X,V:a0", voteString);
                    server.close();
                    test.done();
                }
            );

        server.listen(27180);

        request({
            method: "GET",
            uri: "http://localhost:27180/?for=Xavier&vote=160",
        }).catch(
            (e) => test.ok(0, "The server should respond correctly")
        );
    }
};
