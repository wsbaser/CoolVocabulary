Vocabulary.BookExamIndexRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('language/book/examToolbox', { into: 'language/book', outlet: 'toolbox'} );
		this.render('language/book/exam', { into: 'language/book', outlet: 'content'} );
	},
	parentName: 'book.exam',
	model: function(){
		this.controllerFor('language').set('learnSessionWords', null);
		var sessionTranslations = this.modelFor(this.get('parentName'));
		this.sessionWords = this.getSessionWordsForTranslations(sessionTranslations);
		return this.requestExamWords(this.sessionWords);
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
		var sourceLanguage = this.controllerFor('language').get('model.id');
		var targetLanguage = this.controllerFor('application').get('model.nativeLanguage.id');
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
			var speachPart = item.get('speachPart');
			speachPart = speachPart===SpeachParts.UNKNOWN?SpeachParts.ADVERB:speachPart;
			var wrongTranslations = self.findWrongTranslaions(examWords, excludeList,
				item.get('targetLanguage'), speachPart, WRONG_TRANSLATIONS_COUNT);
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
		this.setWrongTranslations(this.sessionWords, model.content);
		var validSessionWords = this.sessionWords.filterBy('isValid', true);
		this._super(controller, validSessionWords);
		controller.set('parentCtrl', this.controllerFor(this.get('parentName')));
		controller.activateFirstWord();
		this.send('adjustHeight', true);
		Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
		this.controller.get('activeWord').playSound();		
	}
});