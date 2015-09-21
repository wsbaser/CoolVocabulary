Vocabulary.BookIndexController = Ember.Controller.extend({
	setWords: function(bookId){
		var all = this.store.peekAll('bookWord').toArray();
		var result = {};
		for (var i = all.length - 1; i >= 0; i--) {
			var bookword = all[i];
			var translations = bookword.get('translations').toArray();
			for (var j = translations.length - 1; j >= 0; j--) {
				var translation = translations[j];
				var speachPart = translation.get('speachPart');
				var spPairs = result[speachPart];
				if(!spPairs){
					spPairs = result[speachPart] = {};
				}
				var pair = spPairs[bookword.id];
				if(!pair){
					pair = spPairs[bookword.id] = {
						bookword : bookword,
						translations : []
					};
				}
				pair.translations.push(translation);
			}
		}
		for (var sp in result){
			var wordsObj = result[sp];
			var wordsArr = [];
			for (var bookwordId in wordsObj) {
				wordsArr.push(wordsObj[bookwordId]);
			}
			result[sp] = wordsArr;
		}
		console.log(result);
		this.set('words', result);
	},
	nouns: function(){
		return this.get('words')[1];
	}.property(),
	verbs: function(){
		return this.get('words')[2];
	}.property(),
	adjectives: function(){
		return this.get('words')[3];
	}.property(),
	adverbs: function(){
		return this.get('words')[4];
	}.property()
});