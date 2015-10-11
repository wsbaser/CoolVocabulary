Vocabulary.SpeachpartBlockComponent = Ember.Component.extend({
	words: [],
	actions: {
		showDetails: function(bookWordId){
			this.sendAction('showDetails', bookWordId);
		}
	}
});