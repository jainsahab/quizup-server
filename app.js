var lib = {};
var routes = {};
var http = require('http');
lib.Firebase = require("firebase");

exports.lib = lib;

lib.login = function(){
	lib.fireBaseRef = new lib.Firebase('https://quizup.firebaseio.com');
}



var notFound = function(request, response){
	response.writeHead(404, {'Content-Type': 'text/html'});
	response.end("<b>Not Found</b>");
}

lib.listener = function(request, response){
	routes[request.url] && routes[request.url](request, response) || notFound(request, response);
}

lib.login();
console.log("Listening on 8086");
http.createServer(lib.listener).listen(8086);