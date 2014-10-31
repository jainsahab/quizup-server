var routes = require("../routes.js").routes;
var lib = require("./quizupLib.js").lib;
var listener = {};
listener.listen = function(request, response){
	var parseUrlName = /\/\w+[^?]/;
	routes[request.url.match(parseUrlName)] && routes[request.url.match(parseUrlName)](request, response) || lib.notFound(request, response);
}

exports.listener = listener;
