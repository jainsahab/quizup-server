var crypto = require('./lib/encryptor.js').crypto;
var users = require('./users.json');
var url = require('url');
var lib = require('./lib/quizupLib.js').lib;
var routes = {};
var playerAssigned = {player1:false,player2:false};
var game = {};
var playerUrl;

 
routes['/login'] = function (request, response) {
	var loginDetails = url.parse(request.url,true);
	if (!loginDetails.query.email || !loginDetails.query.password) {
		lib.notFound(request,response);
		return;
	};
	var user = users[crypto.encrypt(loginDetails.query.email)];
	if (!user || crypto.encrypt(loginDetails.query.password) != user.password) {
		lib.notFound(request,response);
		return;
	};

	if(!playerAssigned.player1 || playerAssigned.player1 && playerAssigned.player2){
		playerAssigned.player1 = true;
		playerAssigned.player2 = false;
		game = lib.createANewGame();
		playerUrl = lib.assignPlayerTo(game,"player1",crypto.decrypt(user.username));
		lib.putToFirebase("https://quizup.firebaseio.com/doNotChange/game/player1","lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw",game["player1"]);
	}else {
		playerAssigned.player2 = true;
		playerUrl = lib.assignPlayerTo(game,"player2",crypto.decrypt(user.username));
		lib.putToFirebase("https://quizup.firebaseio.com/doNotChange/game/player2","lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw",game["player2"]);
		lib.putToFirebase("https://quizup.firebaseio.com/doNotChange/game/questions","lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw",game["questions"]);
	}
	//Sending game details in response such as firebase token,gameUrl,playername
	response.writeHead(200, {'Content-Type': 'text/json'});
	response.end(JSON.stringify(lib.generateUserDetails(playerUrl,user.username)));
}

exports.routes = routes;