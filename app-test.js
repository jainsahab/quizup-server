var lib = require('./quizupLib.js').lib;
var assert = require('assert');
var test = {};
exports.test = test;


var questionToSet = {
	"Options" : [ null, "no", "yes", "i am not sure", "bilkul nahi" ],
	"answer" : 2,
	"question" : "is this my question?"
};
var realFireBase;

var fireBaseSetCalled = false;
var authWithCustomTokenCalled = false;
var setIntervalCalled = false;

var setUp = function(){
	firstFirebase = lib.Firebase;
	lib.Firebase = function(path){
		this.path = path;
		this.set = function(question){
			fireBaseSetCalled = true;
			assert.deepEqual(this.path, 'https://quizup.firebaseio.com/doNotChange/game/current_question');
			assert.deepEqual(question, questionToSet);
		};
		this.authWithCustomToken = function(token, callBack){
			authWithCustomTokenCalled = true;
			assert.equal(token, "lLwXjNDm5algYXbUEEWekyVr30cgH9nQVW3yiDAw");
	};

	lib.utilities = function(){
		this.fileSystem = {
			readFile : function(file){
				if (file == './questions.json') return JSON.stringify(new Array(questionToSet));
				return JSON.stringify( {"updateQuestionInterval": 1} );
			}
		};
		this.setInterval = function(picker, time, questions){
			setIntervalCalled = true;
			assert.equal(time, 1000);
			assert.deepEqual(questionToSet, questions[0]);
		};
	};

}

};
var tearDown = function(){
	lib.Firebase = firstFirebase;
	fireBaseSetCalled = false;
	authWithCustomTokenCalled = false;
	setIntervalCalled = false;
}


test.should_be_able_to_write_the_question = function(){
	setUp();
    lib.writeQuestion(questionToSet);
    assert.ok(fireBaseSetCalled);
    assert.ok(authWithCustomTokenCalled);
    tearDown();
}

test.should_be_able_to_pick_a_random_question = function(){
	setUp();
	var questions = new Array(questionToSet);
	lib.questionPicker(questions);    
    assert.equal(questions.length, 0);
    assert.ok(fireBaseSetCalled);
    assert.ok(authWithCustomTokenCalled);
    tearDown();
}

test.should_be_able_to_update_question = function(){
	
	setUp();


	
	lib.updateQuestion(new lib.utilities());
	assert.ok(setIntervalCalled);
	tearDown();
}	