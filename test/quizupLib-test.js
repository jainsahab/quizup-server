var lib = require('../lib/quizupLib.js').lib;
var assert = require('assert');
var test = {};
exports.test = test;


var questionsToSet = [{
	"Options": [null, "no", "yes", "i am not sure", "bilkul nahi"],
	"answer": 2,
	"question": "is this my question?"
}];

var fireBaseSetCalled = false;
var authWithCustomTokenCalled = false;

var setUp = function() {
	firstFirebase = lib.Firebase;
	lib.Firebase = function(path) {
		this.path = path;
		this.set = function(questions) {
			fireBaseSetCalled = true;
			assert.deepEqual(this.path, 'https://quizup.firebaseio.com/doNotChange/game/questions');
			assert.deepEqual(questions, questionsToSet);
		};
		this.authWithCustomToken = function(token, callBack) {
			authWithCustomTokenCalled = true;
			assert.equal(token, "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw");
		};
	}
};

var tearDown = function() {
	lib.Firebase = firstFirebase;
	fireBaseSetCalled = false;
	authWithCustomTokenCalled = false;
}

test.should_be_able_to_write_the_questions = function() {
	setUp();
	lib.putQuestions(questionsToSet);
	assert.ok(fireBaseSetCalled);
	assert.ok(authWithCustomTokenCalled);
	tearDown();
}
