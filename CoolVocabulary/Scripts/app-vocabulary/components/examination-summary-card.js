Vocabulary.ExaminationSummaryCardComponent = Ember.Component.extend({
	totalPromoted: Ember.computed('promotes', function(){
		var total = 0;
		this.get('promotes').forEach(function(item){
			total+=item.get('count');
		});
		return total;
	}),
	actions:{
		examine: function(){
			this.get('onExamine')();
		}
	}
});