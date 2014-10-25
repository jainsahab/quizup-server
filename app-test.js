var lib = require('./app.js').lib;
var assert = require('assert');
var test = {};
exports.test = test;

test.should_be_able_to_return_a_firebase_ref = function(){
	lib.login();
	assert.ok(lib.fireBaseRef instanceof lib.Firebase);
}