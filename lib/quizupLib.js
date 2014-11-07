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

lib.onBothPlayerAnswers = function (firstPlayerAnswers,secondPlayerAnswers,gameUrl,game) {
	var firstPlayerPoints = calculatePoints(firstPlayerAnswers,10);
	var secondPlayerPoints = calculatePoints(secondPlayerAnswers,10);
	console.log(firstPlayerPoints+'\n'+secondPlayerPoints);
	var gameStatus = lib.authenticateToFirebase(gameUrl+"/gameStatus","lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw");
	var winner = firstPlayerPoints > secondPlayerPoints ? game.player1.name : game.player2.name;
	gameStatus.set({player1:{points:firstPlayerPoints},player2:{points:secondPlayerPoints},winner:winner});
}

var calculatePoints = function (playerAnswers,point) {
	var timeTaken = 0;
	for (var i = 0; i < playerAnswers.length; i++) {
		var answer = playerAnswers[i];
		timeTaken += answer.timeTaken;
	};
	return parseInt(((playerAnswers.length*10) - timeTaken)*10);
}

lib.putResultAfterCompletion = function (gameUrl,token,game) {
	var player1Ref = lib.authenticateToFirebase(gameUrl+"/player1/answers",token);
	var player2Ref = lib.authenticateToFirebase(gameUrl+"/player2/answers",token);
	var firstPlayerAnswers;
	var secondPlayerAnswers;
	var addPlayerOneAnswerListener = function (callback,gameUrl,game) {
		player1Ref.on('value',function (snapshot) {
			firstPlayerAnswers = snapshot.val();
			if(secondPlayerAnswers)
				callback(firstPlayerAnswers,secondPlayerAnswers,gameUrl,game);
		});	
	};

	var addPlayerTwoAnswerListener = function (callback,gameUrl,game) {
		player2Ref.on('value',function (snapshot) {
			secondPlayerAnswers = snapshot.val();
			if(firstPlayerAnswers)
				callback(firstPlayerAnswers,secondPlayerAnswers,gameUrl,game);
		});	
	}
	addPlayerOneAnswerListener(lib.onBothPlayerAnswers,gameUrl,game);
	addPlayerTwoAnswerListener(lib.onBothPlayerAnswers,gameUrl,game);
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
	console.log("{ player: "+toPlayer+", name: "+username+" }");
	game[toPlayer] = player;
}