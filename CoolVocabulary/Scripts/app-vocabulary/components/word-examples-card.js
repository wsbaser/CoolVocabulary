Vocabulary.WordExamplesCardComponent = Ember.Component.extend({
	classNames: ['word-examples-card'],
	data: Ember.computed('card', function(){
		return this.get('card.data');
	})
	//Ember.computed.alias('card.data')
});