var crypto = require('./lib/encryptor.js').crypto;
var users = require('./users.json');
var url = require('url');
var lib = require('./lib/quizupLib.js').lib;
var routes = {};
var playerStatusObject = {};
var gameObject = {};
var playerUrl;
playerStatusObject.player1 = false;
playerStatusObject.player2 = false;

 
routes['/login'] = function (request, response) {
	var loginDetails = url.parse(request.url,true);
	var user = users[crypto.encrypt(loginDetails.query.username)];
	if (user && crypto.encrypt(loginDetails.query.password) == user.password) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		if(playerStatusObject.player1 == false)
			gameObject = lib.generateGameObject();
		playerUrl = lib.assignPlayerTo(gameObject,playerStatusObject,crypto.decrypt(user.username));
		response.write(JSON.stringify(lib.generateUserDetails(playerUrl,user.username)));
		response.end("<b>Login Successful with username: "+crypto.decrypt(user.username)+" </b>");
	}else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<b>Login Failed</b>");
	}
}

exports.routes = routes;