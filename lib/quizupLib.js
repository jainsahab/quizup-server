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

lib.onBothPlayerAnswers = function (firstPlayerAnswers,secondPlayerAnswers,gameUrl) {
	var firstPlayerPoints = calculatePoints(firstPlayerAnswers,10);
	var secondPlayerPoints = calculatePoints(secondPlayerAnswers,10);
	var gameStatus = lib.authenticateToFirebase(gameUrl+"/gameStatus","lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw");
	var winner = firstPlayerPoints > secondPlayerPoints ? "player1" : "player2" ;
	gameStatus.set({player1:{points:firstPlayerPoints},player2:{points:secondPlayerPoints},winner:winner});
}

var calculatePoints = function (playerAnswers,point) {
	var points = 0;
	for (var i = 0; i < playerAnswers.length; i++) {
		var answer = playerAnswers[i];
		if (answer.isRightAnswer) {
			points += answer.timeTaken*point;
		};
	};
	return points;
}


lib.putResultAfterCompletion = function (gameUrl,token) {
	var player1Ref = lib.authenticateToFirebase(gameUrl+"/player1/answers",token);
	var player2Ref = lib.authenticateToFirebase(gameUrl+"/player2/answers",token);
	var firstPlayerAnswers;
	var secondPlayerAnswers;
	var addPlayerOneAnswerListener = function (callback) {
		player1Ref.on('value',function (snapshot) {
			firstPlayerAnswers = snapshot.val();
			if(secondPlayerAnswers)
				callback(firstPlayerAnswers,secondPlayerAnswers,gameUrl);
		});	
	};

	var addPlayerTwoAnswerListener = function (callback,gameUrl) {
		player2Ref.on('value',function (snapshot) {
			secondPlayerAnswers = snapshot.val();
			if(firstPlayerAnswers)
				callback(firstPlayerAnswers,secondPlayerAnswers,gameUrl);
		});	
	}
	
	addPlayerOneAnswerListener(lib.onBothPlayerAnswers,gameUrl);
	addPlayerTwoAnswerListener(lib.onBothPlayerAnswers,gameUrl);
}

lib.createANewGame = function(){
	var questions = require('../questions.json');
	var game = {};
	game.questions = questions;
	return game;
}

lib.generateUserDetails = function(gameUrl,player,username){
	var playerDetails = {};
	playerDetails.token = "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw";
	playerDetails.gameUrl = gameUrl;
	playerDetails.player = player;
	playerDetails.username = crypto.decrypt(username);
	return playerDetails;
}

lib.assignPlayerTo = function(game,toPlayer,username){
	var player = {};
	player.name = username;
	game[toPlayer] = player;
}