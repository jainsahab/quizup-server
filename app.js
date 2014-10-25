var lib = {};
var routes = {};
var http = require('http');
lib.Firebase = require("firebase");

exports.lib = lib;

var notFound = function(request, response){
	response.writeHead(404, {'Content-Type': 'text/html'});
	response.end("<b>Not Found</b>");
}

lib.login = function(){
	lib.fireBaseRef = new lib.Firebase('https://quizup.firebaseio.com');
}

lib.writeQuestion = function(question){
	var token = "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw";
	var fireBaseWriteRef = new lib.Firebase("https://quizup.firebaseio.com/doNotChange/game/current_question");
	fireBaseWriteRef.authWithCustomToken(token, function(error){
		if(error) console.log("Login Failed");
	})
	fireBaseWriteRef.set(question);
}

lib.listener = function(request, response){
	routes[request.url] && routes[request.url](request, response) || notFound(request, response);
}

lib.login();
console.log("Listening on 8086");
http.createServer(lib.listener).listen(8086);

// 'https://quizup.firebaseio.com/doNotChange/game/current_question'