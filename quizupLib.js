var lib = {};
var routes = {};
var http = require('http');
var fs = require('fs');
lib.Firebase = require("firebase");

exports.lib = lib;
exports.fs = fs;

var notFound = function(request, response){
	response.writeHead(404, {'Content-Type': 'text/html'});
	response.end("<b>Not Found</b>");
}

lib.utilities = function(){
	this.fileSystem = {
		readFile : fs.readFileSync
	};
	this.setInterval = setInterval;

}

lib.questionPicker = function(questions) {
	var randomIndex = Math.floor(Math.random() * questions.length);
	lib.writeQuestion(questions[randomIndex]);
	questions.splice(randomIndex, 1);
} 


lib.updateQuestion = function(utilities){	
	var questions = JSON.parse(utilities.fileSystem.readFile('./questions.json'));
	var config = JSON.parse(utilities.fileSystem.readFile('./config.json'));
	utilities.setInterval(lib.questionPicker, config.updateQuestionInterval * 1000 , questions);
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
