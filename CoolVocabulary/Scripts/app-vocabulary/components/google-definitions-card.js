Vocabulary.GoogleDefinitionsCardComponent = Ember.Component.extend({
	classNames: ['google-definitions-card'],
	data: Ember.computed('card', function(){
		var result = [];
        var data = this.get('card.data');
        for (var sp in data) { 
            result.push({
                sp: sp,
                definitions: data[sp]
            });
        }
		return result;
	})
});