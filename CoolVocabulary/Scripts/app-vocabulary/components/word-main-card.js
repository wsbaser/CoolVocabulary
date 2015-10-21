Vocabulary.WordMainCardComponent = Ember.Component.extend({
	classNames: ['enlarge'],
	classNameBindings:['isActive::hidden'],
	isActive: Ember.computed.alias('card.isActive'),
	word: Ember.computed.alias('card.wordToLearn.word')
});