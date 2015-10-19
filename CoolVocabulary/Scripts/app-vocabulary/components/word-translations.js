Vocabulary.WordTranslationsComponent = Ember.Component.extend({
	speachPartText: Ember.computed('model.speachPart', function(){
		var sp = this.get('speachPart');
		switch(sp){
			case 1: return 'nouns';
			case 2: return 'verbs';
			case 3: return 'adjectives';
			case 4: return 'adverbs';
		}
	}),
	actions:{
		remove: function(){
			console.log("remove translation");
		}
	}
});