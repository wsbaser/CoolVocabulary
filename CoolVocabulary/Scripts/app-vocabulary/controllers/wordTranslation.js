Vocabulary.WordTranslationController = Ember.Controller.extend({
	actions: {
		remove: function(){
			console.log('remove book word');
		},
		move: function(){
			console.log('move word to another book');
		}
	}
});