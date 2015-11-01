Vocabulary.WordTranslationController = Ember.Controller.extend({
	actions: {
		remove: function(){
			if(confirm('Are you sure that you want to delete this word?')){
				this.transitionToRoute('book');
				this.get('model').destroyRecord();
			}
		},
		move: function(){
			console.log('move word to another book');
		},
		hideWordDetails: function(){
			$('#word_details_popover').removeClass('fadein').addClass('fadeout');
			this.transitionToRoute('book');
		},
		translationRemoved: function(){
			if(!this.get('model.translations').toArray().length){
				this.transitionToRoute('book');
				this.get('model').destroyRecord();				
			}
		}
	}
});