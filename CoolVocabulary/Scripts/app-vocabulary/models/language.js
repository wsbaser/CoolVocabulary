Vocabulary.Language = DS.Model.extend({
	name: DS.attr("string"),
	lowerName: Ember.computed('name', function(){
		return this.get('name').toLowerCase();
	})
});