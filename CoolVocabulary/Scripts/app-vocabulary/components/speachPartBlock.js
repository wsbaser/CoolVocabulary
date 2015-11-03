Vocabulary.SpeachpartBlockComponent = Ember.Component.extend({
	bookWwords: null,
	actions: {
		selectWord: function(bookWord){
			this.get('selectWord')(bookWord);
		}
	}
});