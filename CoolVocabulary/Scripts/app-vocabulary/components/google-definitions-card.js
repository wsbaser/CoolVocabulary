Vocabulary.GoogleDefinitionsCardComponent = Ember.Component.extend({
	classNames: ['google-definitions-card'],
    classNameBindings:['isActive::hidden'],
    isActive: Ember.computed.alias('card.isActive'),
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