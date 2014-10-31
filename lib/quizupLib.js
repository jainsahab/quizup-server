var lib = {};
var routes = {};
var http = require('http');
var fs = require('fs');
var crypto = require('./encryptor.js').crypto;
lib.Firebase = require('firebase');

exports.lib = lib;

lib.notFound = function(request, response){
	response.writeHead(404, {'Content-Type': 'text/html'});
	response.end("<b>Not Found</b>");
}

lib.putGame = function(doNotChange){
	var token = "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw";
	var fireBaseWriteRef = new lib.Firebase("https://quizup.firebaseio.com/doNotChange");
	fireBaseWriteRef.authWithCustomToken(token, function(error){
		if(error) console.log("Login Failed");
	});
	fireBaseWriteRef.set(doNotChange);
}


lib.generateUserObject = function(username){
	var obj = {};
	obj.userName = crypto.decrypt(username);
	obj.game = "game";
	obj.fireBaseToken = "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw";
	return obj;
}

lib.generateGameObject = function(){
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

lib.assignPlayerTo = function(game,playerStatusObject,playerName){
	var player = {};
	player.playerUserName = playerName;
	if(playerStatusObject.player1){
		playerStatusObject.player2 = true;
		game.player2 = player;
		playerStatusObject.player1 = false;
		playerStatusObject.player2 = false;
		return "https://quizup.firebaseio.com/doNotChange/game/player2";
	}
	else{
		playerStatusObject.player1 = true;
		game.player1 = player;
		return "https://quizup.firebaseio.com/doNotChange/game/player1";
	}
}