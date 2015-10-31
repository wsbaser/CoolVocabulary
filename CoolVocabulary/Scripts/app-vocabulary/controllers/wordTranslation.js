Vocabulary.WordTranslationController = Ember.Controller.extend({
	actions: {
		remove: function(){
			console.log('remove book word');
		},
		move: function(){
			console.log('move word to another book');
		},
		hideWordDetails: function(){
			//$('#word_details_popover').removeClass('fadein').addClass('fadeout');
			this.transitionToRoute('book');
		}
	}
});