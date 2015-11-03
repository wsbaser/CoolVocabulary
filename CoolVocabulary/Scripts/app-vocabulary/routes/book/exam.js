// . amount of wrong translations for one exam card
var WRONG_TRANSLATIONS_COUNT = 4;

Vocabulary.WordToExam = Ember.Object.extend({
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
			word: this.get('translation')
		}));
		// . shuffle and return
		return translations.sort(function(){ return 0.5-Math.random(); });
	})
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
	getSessionWords: function(bookWords){
		// . agregate data
		var sessionWords = [];
		var DAY = 60*60*24*1000;
		var now = Date.now();
		var randomBookWords = bookWords.filter(function(item){ 
			var examinedAt = item.get('examinedAt') || 0;
			return (now-examinedAt)>DAY;
		}).sort(function(){ return 0.5-Math.random(); });

		for (var i = randomBookWords.length - 1; i >= 0 && sessionWords.length<30; i--) {
			var bookWord = randomBookWords[i];
			var translations = bookWord.get('translations').toArray();
			for (var j = translations.length - 1; j >= 0 && sessionWords.length<30; j--) {
				var translation = translations[j];
				sessionWords.push(Vocabulary.WordToExam.create({
					word: bookWord.get('word.value'),
					sourceLanguage: bookWord.get('word.language'),
					speachPart: bookWord.get('speachPart'),
					translation: translation.get('value'),
					targetLanguage: translation.get('language')
				}));
				sessionWords.push(Vocabulary.WordToExam.create({
					word:translation.get('value'),
					sourceLanguage: translation.get('language'),
					speachPart: bookWord.get('speachPart'),
					translation: bookWord.get('word.value'),
					targetLanguage: bookWord.get('word.language')
				}));
			}
		}

		// . get first 30
		return sessionWords.sort(function(){ return 0.5-Math.random(); });
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
	setWrongTranslations: function(examWords){
		var self = this;
		var sessionWords = this.get('sessionWords');
		examWords = examWords.sort(function() { return 0.5 - Math.random(); });
		sessionWords.forEach(function(item){
			// . for each word find WRONG_TRANSLATIONS_COUNT wrong translations of the same spech part
			var wrongTranslations = self.findWrongTranslaions(examWords, 
				item.get('targetLanguage'), item.get('speachPart'), item.get('translation'),
				WRONG_TRANSLATIONS_COUNT);
			item.setWrongTranslations(wrongTranslations);
		});
	},
	findWrongTranslaions: function(examWords, language, speachPart, correctTranslation, count){
		var result = [];
		for(var i=examWords.length-1; i>=0 && result.length<count; i--){
			var ew = examWords[i].record;
			if( ew.get('language')===language && 
				ew.get('speachPart')===speachPart && 
				ew.get('word')!==correctTranslation){
				result.push(examWords.splice(i, 1)[0].record);
			}
		}
		return result;
	},
	setupController: function(controller, model){
		// . set wordsTranslations
		this.setWrongTranslations(model.content);
		// . set model
		model = this.modelFor('book');
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

   	//    	$('body').on('mousewheel', function(event){
			// if(event.originalEvent.wheelDeltaY<0) {
			// 	$('#learning-cards-shadow').scrollTo('+=300px', 300);
			// 	$('#learning-cards').scrollTo('+=300px', 300);
			// } else {
			// 	$('#learning-cards-shadow').scrollTo('-=300px', 300);
			// 	$('#learning-cards').scrollTo('-=300px', 300);
			// }
   //    	});
	}
});