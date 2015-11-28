// . amount of wrong translations for one exam card
var WRONG_TRANSLATIONS_COUNT = 4;
var SESSION_WORDS_COUNT = 15;

Vocabulary.WordToExam = Ember.Object.extend({
	speachPart: Ember.computed.alias('translation.bookWord.speachPart'),
	init: function(){
 		if(this.get('isStraight')){
			this.set('sourceWord', this.get('translation.bookWord.word.value'));
			this.set('targetWord', this.get('translation.value'));
			this.set('sourceLanguage', this.get('translation.bookWord.word.language'));
			this.set('targetLanguage', this.get('translation.language'));
 		}
 		else{
			this.set('sourceWord', this.get('translation.value'));
			this.set('targetWord', this.get('translation.bookWord.word.value'));
			this.set('sourceLanguage', this.get('translation.language'));
			this.set('targetLanguage', this.get('translation.bookWord.word.language'));
 		}
	},
	statusChanged: Ember.observer('isActive','isExamined', function(){
		return Ember.run.once(this,'setIsHighlighted');
	}),
	setIsHighlighted: function(){
		this.set('isHighlighted', this.get('isActive') || this.get('isExamined'));
	},
	setWrongTranslations: function(wrongTranslations){
		// . set wordTranslations property
		if(wrongTranslations && wrongTranslations.length){
			this.set('wrongTranslations', wrongTranslations);
			this.set('isValid', true);	
		}
	},
	translations: Ember.computed('wrongTranslations', function(){
		// . clone wrongTranslations array
		var translations = this.get('wrongTranslations').map(function(item){
			return Ember.Object.create({
				word: item.get('word')
			});
		});
		// . correct translation
		translations.push(Ember.Object.create({
			word: this.get('targetWord')
		}));
		// . shuffle and return
		return translations.shuffle();
	}),
	link: function(wordToLearn){
		this.set('bro', wordToLearn);
		wordToLearn.set('bro', this);
	},
	allCorrect: function(){
		return this.get('isMistake')===false && this.get('bro.isMistake')===false;
	},
	allExamined: function(){
		return this.get('isExamined') && this.get('bro.isExamined');
	}
});

Vocabulary.BookExamRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/examToolbox', {outlet: 'toolbox'});
		this.render('book/exam', {outlet: 'content'});
	},
	sessionWords: null,
	model: function(){
		var sessionWords;
		var bookController = this.controllerFor('book');
		var learnSessionWords = bookController.get('learnSessionWords');
		var bookWords = [];
		if(learnSessionWords){
			bookController.set('learnSessionWords', null);
			learnSessionWords.forEach(function(item){
				item.get('bookWords').forEach(function(bookWord){
					bookWords.push(bookWord);
				});
			});
		}
		else {
			bookWords = this.modelFor('book').get('bookWords');
		}
		sessionWords = this.getSessionWords(bookWords);
		this.set('sessionWords', sessionWords);
		return this.requestExamWords(sessionWords);
	},
	afterModel: function(){
		var sessionWords = this.get("sessionWords");
		if(!sessionWords||!sessionWords.toArray().length){
			alert('Add words!');
			this.transitionTo('book');
		}
	},
	getSessionWords: function(bookWords){
		// . get all translations		
		var translations = [];
		bookWords.forEach(function(bookWord){
			var notCompleted = bookWord.get('translations').filter(function(item){
				return item.get('learnLevel')<MAX_LEARN_LEVEL;
			}).toArray();
			translations = translations.concat(notCompleted);
		});
		// . take 15 translations
		var DAY = 60*60*24*1000;
		var now = Date.now();
		translations = translations.sort(function(item1,item2){ 
			var examinedAt1 = item1.get('examinedAt') || 0;
			var examinedAt2 = item2.get('examinedAt') || 0;
			return examinedAt1>examinedAt2?1:(examinedAt1===examinedAt2?0:-1);
		}).slice(0, SESSION_WORDS_COUNT);
		// . randomize translations
		translations.shuffle();	// sort(function(){ return 0.5-Math.random(); });

		// . generate session words
		var sessionWords = [];
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
			sessionWords.push(w1);
			sessionWords.push(w2);
		});

		return sessionWords.sort(function(){ return 0.5-Math.random(); });
	},
	requestExamWords: function(sessionWords){
		if(!sessionWords.length){
			return null;
		}
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
	setWrongTranslations: function(examWords){
		var self = this;
		var sessionWords = this.get('sessionWords');
		examWords = examWords.sort(function() { return 0.5 - Math.random(); });
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
		// . set wordsTranslations
		this.setWrongTranslations(model.content);
		// . set model
		model = this.controllerFor('book').get('model');
		this._super(controller, model);
		// . set session data
		var sessionWords = this.get('sessionWords').filterBy('isValid', true);
		controller.set('sessionWords', sessionWords);
		// . set active word
		controller.activateFirstWord();
		
	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
	// . bind touch events here
	},
	actions: {
		sessionChanged: function(){
    		this.refresh();
  		}
	}
});