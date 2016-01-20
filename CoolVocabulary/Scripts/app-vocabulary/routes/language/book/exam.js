Vocabulary.BookExamRoute = Ember.Route.extend(Vocabulary.ExamRouteBase, {
	renderTemplate: function(){
		// . do not render anything here
	},
	model: function(){
		var languageCtrl = this.controllerFor('language');
		var bookController = this.controllerFor('book');
		var userBook = bookController.get('model');
		var learnSessionWords = bookController.get('learnSessionWords');
		if(learnSessionWords){
			bookController.set('learnSessionWords', null);
			return this.getSessionTranslationsForLearnSessionWords(languageCtrl, learnSessionWords, userBook);
		}
		else {
			var sessionTranslations = this.getSessionTranslations(languageCtrl, userBook);
			if(this.checkSessionTranslations(sessionTranslations)){
				return sessionTranslations;
			}else{
				this.transitionTo('book');
			}
		}
	},
	getSessionTranslationsForLearnSessionWords: function(languageCtrl, learnSessionWords, userBook){
		var translationIds = [];
		learnSessionWords.forEach(function(sessionWord){
			sessionWord.get('bookWords').forEach(function(bookWord){
				bookWord.get('translations').forEach(function(translation){
					translations.push(translation.get('id'));
				});
			});
		});
		var sessionTranslationIds = languageCtrl.getSessionTranslations(translationIds, userBook);
		return languageCtrl.getTranslationsFromStore(sessionTranslationIds);
	},
	getSessionTranslations: function(languageCtrl, userBook){
		var active = languageCtrl.getActiveTranslations(userBook);
		var sessionTranslationIds = languageCtrl.getSessionTranslations(active.inProgress, userBook);
		return languageCtrl.getTranslationsFromStore(sessionTranslationIds);
	},
	checkSessionTranslations: function(sessionTranslations){
		var self = this;
		if(!sessionTranslations||!sessionTranslations.toArray().length){
			var message;
			var bookWords = this.modelFor('book').get('book.bookWords').toArray();
			if(bookWords.length){
				message = '<b>No more examinations for today!</b><br><br>'+
					'You can examinate each word only once a day.<br>'+
					'Come back tommorow or be a good monkey and examinate words from other books.';
			}else{
				message = '<b>Nothing to examinate!</b><br><br>'+
					'Add words to the book. It is simple.<br>'+
					'Or find a book in our collection of published books and examinate words from it.';
			}
			BootstrapDialog.alert({
			    title: 'Warning',
			    message: message
	        });
	        return false;
		}
		return true;
	}
});

Vocabulary.BookExamIdexRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('language/book/examToolbox', { into: 'language/book', outlet: 'toolbox'} );
		this.render('language/book/exam', { into: 'language/book', outlet: 'content'} );
	},	
	model: function(){
		var sessionTranslations = thid.modelFor('book.exam');
		this.sessionWords = this.getSessionWordsForTranslations(sessionTranslations);
		return this.requestExamWords(sessionWords);
	},
	getSessionWordsForTranslations: function(translations){
		// . generate session words
		var straight = Ember.A();
		var backward = Ember.A();
		translations.forEach(function(translation){
			var w1 = Vocabulary.WordToExam.create({
				isStraight: true,
				translation: translation
			});
			var w2 = Vocabulary.WordToExam.create({
				isStraight: false,
				translation: translation
			});
			w1.link(w2);
			straight.push(w1);
			backward.push(w2);
		});
		return straight.shuffle().sortBy('speachPart').concat(backward.shuffle().sortBy('speachPart'));
	},
	requestExamWords: function(sessionWords){
		var sourceLanguage = sessionWords[0].sourceLanguage;
		var targetLanguage = sessionWords[0].targetLanguage;
		// . count number of nouns, verbs, adjectives, adverbs
		var nounsCount, verbsCount, adjectivesCount, adverbsCount;
		nounsCount = verbsCount = adjectivesCount = adverbsCount = 0;
		sessionWords.forEach(function(item){
			switch(item.get('speachPart')){
				case SpeachParts.NOUN:
					nounsCount++;
					break;
				case SpeachParts.VERB:
					verbsCount++;
					break;
				case SpeachParts.ADJECTIVE:
					adjectivesCount++;
					break;
				case SpeachParts.ADVERB:
					adverbsCount++;
					break;
				default:
					adverbsCount++;
					break;
					//throw new Error('Unknow speach part');
			}
		});
		// . request exam words
		return this.store.query('examWord', { 
			sourceLanguage: sourceLanguage,
			targetLanguage: targetLanguage,
			nounsCount: nounsCount*WRONG_TRANSLATIONS_COUNT,
			verbsCount: verbsCount*WRONG_TRANSLATIONS_COUNT,
			adjectivesCount: adjectivesCount*WRONG_TRANSLATIONS_COUNT,
			adverbsCount: adverbsCount*WRONG_TRANSLATIONS_COUNT });
	},
	setWrongTranslations: function(sessionWords, examWords){
		var self = this;
		examWords.shuffle();
		sessionWords.forEach(function(item){
			var excludeList = item.get('translation.bookWord.translations')
				.map(function(translation){ return translation.get('value'); });
			// . for each word find WRONG_TRANSLATIONS_COUNT wrong translations of the same speach part
			var wrongTranslations = self.findWrongTranslaions(examWords, excludeList,
				item.get('targetLanguage'), item.get('speachPart'), WRONG_TRANSLATIONS_COUNT);
			item.setWrongTranslations(wrongTranslations);
		});
	},
	findWrongTranslaions: function(examWords, excludeList, language, speachPart, count){
		var result = [];
		for(var i=examWords.length-1; i>=0 && result.length<count; i--){
			var ew = examWords[i].record;
			if( ew.get('language')===language && 
				ew.get('speachPart')===speachPart && 
				excludeList.indexOf(ew.get('word'))===-1){
				result.push(examWords.splice(i, 1)[0].record);
			}
		}
		return result;
	},
	setupController: function(controller, model){
		this.setWrongTranslations(this.sessionWords, model);
		var validSessionWords = this.sessionWords.filterBy('isValid', true);		
		this._super(controller, validSessionWords);
		controller.activateFirstWord();
	},
	actions: {
		sessionChanged: function(){
    		this.refresh();
  		}
	}
});