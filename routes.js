var crypto = require('./lib/encryptor.js').crypto;
var users = require('./users.json');
var url = require('url');
var routes = {};

routes['/login'] = function function_name (request, response) {
	var loginDetails = url.parse(request.url,true);
	var user = users[crypto.encrypt(loginDetails.query.email)];
	if (user && crypto.encrypt(loginDetails.query.password) == user.password) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end("<b>Login Successful with username: "+crypto.decrypt(user.username)+" </b>");
	}else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<b>Login Failed</b>");
	}
}

exports.routes = routes;