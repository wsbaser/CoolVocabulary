Vocabulary.WordPicturesComponent = Ember.Component.extend({
	classNames: ['word-pictures-block'],
	hasPictures: Ember.computed('word', function(){
		var pictureUrls = this.get('word.pictureUrls');
		return pictureUrls && pictureUrls.trim()!=='';
	}),
	pictures: Ember.computed('word', function(){
		var pictureUrls = this.get('word.pictureUrls');
		var result = [];
		if(pictureUrls) {
			result = pictureUrls.split(',');
			result = result.filter(function(item){ return item.trim()!==''; });
		}
		return result;
	})
});