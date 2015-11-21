Vocabulary.LearningCardComponent = Ember.Component.extend({
	classNames: ['learning-card', 'light-shadow'],
	attributeBindings: ['id'],
	id: Ember.computed('wordToLearn', function(){
		var wordId = this.get('wordToLearn.word.id');
		return 'learning_card_' + wordId;		
	})
});