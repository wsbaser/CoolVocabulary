Vocabulary.WordTranslationController = Ember.Controller.extend({
	hasPictures: Ember.computed('model.pictureUrls', function(){
		var pictureUrls = this.get('model.word.pictureUrls');
		return pictureUrls && pictureUrls.trim()!=='';
	}),
	actions: {
		remove: function(){
			console.log('remove book word');
		}
	}
});