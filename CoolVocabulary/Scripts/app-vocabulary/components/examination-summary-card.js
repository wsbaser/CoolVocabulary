Vocabulary.ExaminationSummaryCardComponent = Ember.Component.extend({
	init: function(){
		this._super.call(this, arguments);
		var total = 0;
		this.get('promotes').forEach(function(item){
			total+=item.get('count');
		});
		this.set('totalPromoted', total);
	}
});