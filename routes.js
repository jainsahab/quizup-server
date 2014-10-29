var users = require('./users.json');
var url = require('url');
var routes = {};

var encrypt =  function(utf8_string) {
	return new Buffer(utf8_string).toString('base64');
}
var decrypt = function(base64_stream) {
	return new Buffer(base64_stream, 'base64').toString('ascii');
}

routes['/login'] = function function_name (request, response) {
	var loginDetails = url.parse(request.url,true);
	var user = users[encrypt(loginDetails.query.username)];
	if (user) {
		response.writeHead(200, {'Content-Type': 'text/html'});
		response.end("<b>Login Successful with username: "+decrypt(user.username)+"</b>");
	}else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end("<b>Login Failed</b>");
	}
}

exports.routes = routes;