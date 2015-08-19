window.Vocabulary = Ember.Application.create({
	LOG_TRANSITIONS : true
});

Vocabulary.Router.map(function(){
	this.route('words', { path:'/' });
	this.route('learn');
	this.route('exam');
});