Vocabulary.LearningSummaryCardComponent = Ember.Component.extend({
	actions:{
		examine: function(){
			this.get('onExamine')();
		}
	}
});