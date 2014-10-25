var lib = require('./app.js').lib;
var assert = require('assert');
var test = {};
exports.test = test;


var questionToSet = {
	"Options" : [ null, "no", "yes", "i am not sure", "bilkul nahi" ],
	"answer" : 2,
	"question" : "is this my question?"
};

test.should_be_able_to_return_a_firebase_ref = function(){
	lib.login();
	assert.ok(lib.fireBaseRef instanceof lib.Firebase);
}

test.should_be_able_to_update_the_question = function(){
	lib.Firebase = function(path){
		this.path = path;
		this.set = function(question){
			assert.deepEqual(this.path, 'https://quizup.firebaseio.com/doNotChange/game/current_question');
			assert.deepEqual(question, questionToSet);
		};
		this.authWithCustomToken = function(token, callBack){
			assert.equal(token, "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw");
		}
	}
    
    lib.writeQuestion(questionToSet);
}