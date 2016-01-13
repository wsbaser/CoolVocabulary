Vocabulary.LearningSummaryCardComponent = Ember.Component.extend({
	init: function(){
		var learnCtrl = this.get('learnCtrl');
		console.log(learnCtrl);
		this._super();
	},
	learnCtrl: Ember.inject.controller('book.learn'),
	onIsSummaryChange: Ember.observer('learnCtrl.isSummary', function(){
		var isSummary = this.get('learnCtrl.isSummary');
		if(isSummary){
			this.$('.summary-card .actions button')[0].focus();	
		}
	}),
	actions:{
		examine: function(){
			this.get('onExamine')();
		}
	}
});