Vocabulary.LearningCardNavigationComponent = Ember.Component.extend({
	cards: Ember.computed.alias('wordToLearn.cards'),
	actions:{
		select: function(card){
			this.get('wordToLearn').activateCard(card);
		}
	}
});