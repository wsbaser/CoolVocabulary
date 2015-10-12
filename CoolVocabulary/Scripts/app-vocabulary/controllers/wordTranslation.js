Vocabulary.WordTranslationController = Ember.Controller.extend({
	hasPictures: Ember.computed('model.pictureUrls', function(){
		var pictureUrls = this.get('model.word.pictureUrls');
		return pictureUrls && pictureUrls.trim()!=='';
	})
});