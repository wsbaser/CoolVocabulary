Vocabulary.ExaminationSummaryCardComponent = Ember.Component.extend({
	totalPromoted: Ember.computed('promotes', function(){
		var total = 0;
		this.get('promotes').forEach(function(item){
			total+=item.get('count');
		});
		return total;
	}),
	actions:{
		examMore: function(){
			this.get('onExamMore')();
		},
		learnMore: function(){
			this.get('onLearnMore')();
		}
	}
});