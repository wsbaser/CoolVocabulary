Vocabulary.WordTranslationController = Ember.Controller.extend({
	hasPictures: Ember.computed('model.pictureUrls', function(){
		var pictureUrls = this.get('model.word.pictureUrls');
		return pictureUrls && pictureUrls.trim()!=='';
	}),
	speachPartText: Ember.computed('model.speachPart', function(){
		var sp = this.get('model.speachPart');
		switch(sp){
			case 1: return 'nouns';
			case 2: return 'verbs';
			case 3: return 'adjectives';
			case 4: return 'adverbs';
		}
	}),
	actions: {
		remove: function(){
			console.log('remove book word');
		},
		move: function(){
			console.log('move word to another book');
		}
	}
});