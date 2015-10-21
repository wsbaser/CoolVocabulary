Vocabulary.WordExamplesCardComponent = Ember.Component.extend({
	classNames: ['word-examples-card'],
	classNameBindings:['isActive::hidden'],
	isActive: Ember.computed.alias('card.isActive'), 
	data: Ember.computed.alias('card.data')
});