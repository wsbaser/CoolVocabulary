Vocabulary.BookLearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		// . do not render anything here
	},
	model: function(params){
		var bookCtrl = this.controllerFor('book');
		if(+params.word_id){
			this.isSingleWord = true;
			return getSessionBookWordsForWordId(bookCtrl, +params.word_id);
		}
		else{
			var sessionBookWords = this.getSessionBookWords(bookCtrl);
			if(this.checkSessionBookWords(sessionBookWords)){
				return sessionBookWords;
			}
			else{
				this.transitionTo('book');
			}
		}
	},
	getSessionBookWordsForWord: function(userBook, wordId){
		return bookCtrl.get('model.book.bookWords').filterBy('word.id', wordId);
	},
	getSessionBookWords: function(){
		var bookWords = bookCtrl.getActiveBookWordsSortedByLearnDates();
		var sessionBookWords = [];
		var sessionWordIds = [];
		for(var i =0; i<bookWords.length; i++){
			var wordId = bookWords[i].get('word.id');
			if(sessionWordIds.indexOf(wordId)===-1){
				if(sessionWordIds.length<15){
					sessionWordIds.push(wordId);
					sessionBookWords.push(bookWords[i]);
				}
			}
			else{
				sessionBookWords.push(bookWords[i]);
			}
		}
		return sessionBookWords;
	},
	checkSessionBookWords: function(sessionBookWords){
		if(!sessionBookWords || !sessionBookWords.toArray().length){
			BootstrapDialog.alert({
			    title: 'Warning',
			    message: '<b>Please add words to your book first!</b><br><br>'+
				'Alternatively, you can look up our collection of published books, find a suitable one and learn words from it.'
	        });
			return false;
		}
		return true;
	},
	setupController: function(controller, model){
		controller.set('isSingleWord', this.isSingleWord);
		this._super(controller, model);
	}
});

Vocabulary.BookLearnIndexRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('language/book/learnToolbox', { outlet: 'toolbox'});
		this.render('language/book/learn', { outlet: 'content'});
	},
	model: function(){
		var sessionBookWords = thid.modelFor('book.learn');
		this.sessionWords = this.getSessionWords(sessionBookWords);
		return this.requestWordTranslations(this.sessionWords, 0, SESSION_WORDS_COUNT);
	},
	getSessionWords: function(sessionBookWords){
		var wordsDictionary = {};
		sessionBookWords.forEach(function(bookWord){
			var wordId = bookWord.get('word.id');
			if(!wordsDictionary[wordId]){
				wordsDictionary[wordId] = Vocabulary.WordToLearn.create({ 
					word: word,
					bookWords: Ember.A(),
					cards: Ember.A()
				});
			}
			wordsDictionary[wordId].addBookWord(bookWords[i]);
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
			dict[wt.record.get('word')].setWordTranslations(wt.record);
		});
	},
	setupController: function(controller, model){
		this.setWordTranslations(this.sessionWords, model);
		this._super(controller, this.sessionWords);
		controller.setupSession(this.sessionWords);
	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
		this.controller.get('activeWord').playSound();		
	}
});
