var lib = require("./lib/quizupLib.js").lib;
var http = require("http");
console.log("Listening on 8086");
http.createServer(lib.listener).listen(8086);