Vocabulary.WordPicturesComponent = Ember.Component.extend({
	word: null,
	pictures: Ember.computed('word', function(){
		var pictureUrls = this.get('word').get('pictureUrls');
		var result = [];
		if(pictureUrls) {
			result = pictureUrls.split(',');
			result = result.filter(function(item){ return item.trim()!==''; });
		}
		return result;
	})
});