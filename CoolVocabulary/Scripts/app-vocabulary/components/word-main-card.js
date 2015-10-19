Vocabulary.WordMainCardComponent = Ember.Component.extend({
	classNames: ['enlarge'],
	word: Ember.computed.alias('card.wordToLearn.word')
});