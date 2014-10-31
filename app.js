var listener = require("./lib/listener.js").listener;
var http = require("http");
console.log("Listening on 8086");
http.createServer(listener.listen).listen(8086);