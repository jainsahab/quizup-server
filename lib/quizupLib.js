var lib = {};
var routes = {};
var http = require('http');
var fs = require('fs');
var crypto = require('./encryptor.js').crypto;
lib.Firebase = require('firebase');

exports.lib = lib;

lib.notFound = function(request, response){
	response.writeHead(404, {'Content-Type': 'text/json'});
	response.end(JSON.stringify({'status' : 'Content not found.'}));
}

lib.putToFirebase = function(firebaseUrl,token,object){
	var firebaseRef = lib.authenticateToFirebase(firebaseUrl,token);
	firebaseRef.set(object);
}

lib.authenticateToFirebase = function(firebaseUrl,token){
	var firebaseRef = new lib.Firebase(firebaseUrl);
	firebaseRef.authWithCustomToken(token, function(error){
		if(error) console.log("Login Failed.");
	});
	return firebaseRef;
}

// lib.generateUserObject = function(username){
// 	var obj = {};
// 	obj.userName = crypto.decrypt(username);
// 	obj.game = "game";
// 	obj.fireBaseToken = "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw";
// 	return obj;
// }

lib.createANewGame = function(){
	var questions = require('../questions.json');
	var game = {};
	game.questions = questions;
	return game;
}

lib.generateUserDetails = function(playerUrl,username){
	var playerDetails = {};
	playerDetails.token = "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw";
	playerDetails.gameUrl = playerUrl;
	playerDetails.username = crypto.decrypt(username);
	return playerDetails;
}

lib.createAnswersArray = function(length) {
	var answers = [];
	for (var i = 0;i < length; i++) {
		answers[i] = {
			isRightAnswer : false,
			timeTaken : ''
		}
	};
	return answers;
};

lib.assignPlayerTo = function(game,toPlayer,username){
	var player = {};
	player.name = username;
	player.answers = lib.createAnswersArray(10);
	game[toPlayer] = player;
	return "https://quizup.firebaseio.com/doNotChange/game/"+toPlayer;
}