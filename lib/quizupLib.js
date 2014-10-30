var lib = {};
var routes = {};
var http = require('http');
var fs = require('fs');
var routes = require('../routes').routes;
lib.Firebase = require("firebase");

exports.lib = lib;

var notFound = function(request, response){
	response.writeHead(404, {'Content-Type': 'text/html'});
	response.end("<b>Not Found</b>");
}

lib.putQuestions = function(questions){
	var token = "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw";
	var fireBaseWriteRef = new lib.Firebase("https://quizup.firebaseio.com/doNotChange/game/questions");
	fireBaseWriteRef.authWithCustomToken(token, function(error){
		if(error) console.log("Login Failed");
	});
	fireBaseWriteRef.set(questions);
}

lib.listener = function(request, response){
	var parseUrlName = /\/\w+[^?]/;
	routes[request.url.match(parseUrlName)] && routes[request.url.match(parseUrlName)](request, response) || notFound(request, response);
}