Vocabulary.SpeachpartBlockComponent = Ember.Component.extend({
	bookWordsSorting: ['learnLevel'],
	sortedBookWords:Ember.computed.sort('bookWords','bookWordsSorting'),
	actions: {
		selectWord: function(bookWord){
			this.get('selectWord')(bookWord);
		}
	}
});