Vocabulary.WordToExam = Ember.Object.extend({
});

Vocabulary.BookExamRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/examToolbox', {outlet: 'toolbox'});
		this.render('book/exam', {outlet: 'content'});
	},
	sessionWords: null,
	model: function(){
		var book = this.modelFor('book');
		var sessionWords = this.getSessionWords(book);
		this.set('sessionWords', sessionWords);
		return this.requestExamWords(sessionWords);
	},
	getSessionWords: function(book){
		// . agregate data
		var wordsArr = [];
		var DAY = 60*60*24*1000;
		var now = Date.now();
		book.get('bookWords').filter(function(item){ 
			var learnedAt = item.get('learnedAt') || 0;
			return (now-learnedAt)>DAY;
		}).forEach(function(bookWord){
			item.get('translations').forEach(function(translation){
				wordsArr.push(Vocabulary.WordToExam({
					word: bookWord.get('word.value'),
					sourceLanguage: bookWord.get('word.language'),
					speachPart: translation.get('speachPart'),
					translation: translation.get('value'),
					targetLanguage: translation.get('language')
				}));
				wordsArr.push(Vocabulary.WordToExam({
					word:translation.get('value'),
					sourceLanguage: translation.get('language'),
					speachPart: translation.get('speachPart'),
					translation: bookWord.get('word.value'),
					targetLanguage: bookWord.get('word.language')
				}));
			});
		});

		wordsArr = wordsArr.sort(function(){ return 0.5-Math.random(); });

		// . get first 30
		return wordsArr.slice(0, 30);
	},
	requestExamWords: function(sessionWords){
		var sourceLanguage = sessionWords[0].sourceLanguage;
		var targetLanguage = sessionWords[0].targetLanguage;
		// . count number of nouns, verbs, adjectives, adverbs
		var nounsCount, verbsCount, adjectivesCount, adverbsCount;
		nounsCount = verbsCount = adjectivesCount = adverbsCount = 0;
		sessionWords.forEach(function(item){
			switch(item.get('speachPart')){
				case SpeachPart.NOUN:
					nounsCount++;
					break;
				case SpeachPart.VERB:
					verbsCount++;
					break;
				case SpeachPart.ADJECTIVE:
					adjectivesCount++;
					break;
				case SpeachPart.ADVERB:
					adverbsCount++;
					break;
				default:
					throw new Error('Unknow speach part');
			}
		});
		// . request exam words
		return this.store.query('examWord', { 
			sourceLanguage: sourceLanguage,
			targetLanguage: targetLanguage,
			nounsCount: nounsCount,
			verbsCount: verbsCount,
			adjectivesCount: adjectivesCount,
			adverbsCount: adjectivesCount });
	},
	setWrongTranslations: function(examWords){
		var sessionWords = this.get('sessionWords');
		examWords = examWords.sort(function() { return 0.5 - Math.random(); });
		sessionWords.forEach(function(item){
			// . for each word find 4 wrong translations of the same spech part
			var wrongTranslations = this.findWrongTranslaions(examWords, 
				item.get('targetLanguage'), item.get('speachPart'), item.get('translation'), 4);
			item.setWrongTranslations(wrongTranslations);
		});
	},
	findWrongTranslaions: function(examWords, language, speachPart, correctTranslation count){
		var result = [];
		for(var i=examWords.length; i>=0 && result.length<count; i--){
			var ew = examWords[i];
			if( ew.get('language')===language && 
				ew.get('speachPart')===speachPart && 
				ew.get('word')!==correctTranslation){
				result.push(examWords.splice(i, i+1));
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
		controller.set('sessionWords', this.get('sessionWords'));
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