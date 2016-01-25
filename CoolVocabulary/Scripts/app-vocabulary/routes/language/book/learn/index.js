Vocabulary.BookLearnIndexRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('language/book/learnToolbox', { into: 'language/book', outlet: 'toolbox'});
		this.render('language/book/learn', { into: 'language/book', outlet: 'content'});
	},
	parentName: 'book.learn',
	model: function(){
		var sessionBookWords = this.modelFor(this.get('parentName'));
		this.sessionWords = this.getSessionWords(sessionBookWords);
		return this.requestWordTranslations(this.sessionWords, 0, SESSION_WORDS_COUNT);
	},
	getSessionWords: function(sessionBookWords){
		var wordsDictionary = {};
		sessionBookWords.forEach(function(bookWord){
			var word =  bookWord.get('word');
			var userBook = bookWord.get('book.userBook');
			var wordId = word.get('id');
			if(!wordsDictionary[wordId]){
				wordsDictionary[wordId] = Vocabulary.WordToLearn.create({ 
					word: word,
					userBook: userBook,
					bookWords: Ember.A(),
					cards: Ember.A()
				});
			}
			wordsDictionary[wordId].addBookWord(bookWord);
		});
		var wordsArr = [];
		for(var key in wordsDictionary){
			wordsArr.push(wordsDictionary[key]);
		}
		return wordsArr.shuffle();
	},
	requestWordTranslations: function(sessionWords, start , count){
		if(!sessionWords.length){
			return null;
		}
		var wordsRange = sessionWords.slice(start, start + count);
		var wordsRangeIds = wordsRange.map(function(item){ 
			return item.get('word.id'); 
		});
		var applicationCtrl = this.controllerFor('application');
		return this.store.query('wordTranslation', { 
			ids: wordsRangeIds,
			targetLanguage: applicationCtrl.get('model.nativeLanguage.id') 
		});
	},
	setWordTranslations: function(sessionWords, wordTranslations){
		var dict = {};
		sessionWords.forEach(function(wtl){
			dict[wtl.get('word.value')] = wtl;
		});
		wordTranslations.forEach(function(wt){
			dict[wt.get('word')].setWordTranslations(wt);
		});
	},
	setupController: function(controller, model){
		this.setWordTranslations(this.sessionWords, model.toArray());
		this._super(controller, this.sessionWords);
		controller.set('parentCtrl', this.controllerFor(this.get('parentName')));
		controller.setupSession();
	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
		this.controller.get('activeWord').playSound();		
	}
});