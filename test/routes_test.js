var test = {};
exports.test = test;
var proxyquire =  require('proxyquire')
var assert = require('assert');
var crypto = require('../lib/encryptor.js').crypto;
var routes;
var users = {}
var response = {};
var request = {};

var setUp = function() {
	var email = crypto.encrypt('EMAIL');
	var username = crypto.encrypt('USERNAME');
	var password = crypto.encrypt('PASSWORD');
	users[email] = {username : username , password : password};
	routes = proxyquire('../routes.js',{'./users.json':users}).routes;
	request = { url:request.test_url };
	response = {};
	response.end = function (message) {
		assert.deepEqual(response.test_message,JSON.parse(message));
	};
	response.writeHead = function (statuscode,header) {
		assert.equal(response.test_statuscode,statuscode);
		assert.deepEqual(response.test_header,header);
	};
};
var tearDown = function() {
	users = {};
	request = {};
};

test.login_with_existing_login_email_and_password_credentials_says_login_successful = function (argument) {
	setUp();
	response.test_statuscode = 200;
	response.test_header = {'Content-Type' : 'text/json'};
	response.test_message = {token:'lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw',gameUrl:'https://quizup.firebaseio.com/doNotChange/game',player:"player1",username: "USERNAME"}
	request.url = '/login?email=EMAIL&password=PASSWORD';
	request.test_url = '/login?email=EMAIL&password=PASSWORD';
	routes['/login'](request,response);
	tearDown();
}
test.login_with_wrong_login_email_says_login_failure = function (argument) {
	setUp();
	response.test_message = {"status":"Content not found."};
	response.test_statuscode = 404;
	response.test_header = {'Content-Type' : 'text/json'};
	request.url = '/login?email=ANTHER_EMAIL&password=PASSWORD';
	request.test_url = '/login?email=EMAIL&password=PASSWORD';
	routes['/login'](request,response);
	tearDown();
}

test.login_with_wrong_login_password_says_login_failure = function (argument) {
	setUp();
	response.test_message = {"status":"Content not found."}
	response.test_statuscode = 404;
	response.test_header = {'Content-Type' : 'text/json'};
	request.url = '/login?email=EMAIL&password=ANOTHER_PASSWORD';
	request.test_url = '/login?email=EMAIL&password=PASSWORD';
	routes['/login'](request,response);
	tearDown();
}