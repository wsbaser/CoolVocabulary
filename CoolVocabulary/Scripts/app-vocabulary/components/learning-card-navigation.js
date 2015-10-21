Vocabulary.LearningCardNavigationComponent = Ember.Component.extend({
	actions:{
		select: function(card){
			this.get('cards').forEach(function(card){
				card.set('isActive', false);
			});
			card.set('isActive', true);
		}
	}
});