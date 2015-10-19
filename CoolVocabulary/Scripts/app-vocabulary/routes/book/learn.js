Vocabulary.BookLearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/learnToolbox', {outlet: 'toolbox'});
		this.render('book/learn', {outlet: 'content'});
	},
	sessionWords: null,
	model: function(){
		var book = this.modelFor('book');
		var sessionWords = this.getSessionWords(book);
		this.set('sessionWords', sessionWords);
		return this.requestWordTranslations(sessionWords, 0, 3);
	},
	requestWordTranslations: function(sessionWords, start , count){
		var wordsRange = sessionWords.slice(start, count);
		var wordsRangeIds = wordsRange.map(function(item){ 
			return item.get('word.id'); 
		});
		return this.store.query('wordTranslation', { 
			ids: wordsRangeIds,
			targetLanguage: 'ru' 
		});
	},
	setWordTranslations: function(wordTranslations){
		var dict = {};
		var sessionWords = this.get('sessionWords');
		sessionWords.forEach(function(wtl){
			dict[wtl.get('word.value')] = wtl;
		});
		wordTranslations.forEach(function(wt){
			dict[wt.record.get('word')].setWordTranslations(wt.record);
		});
	},
	getSessionWords: function(book){
		// . agregate data
		var wordsDictionary = {};
		var wordsArr = [];
		book.get('bookWords').forEach(function(item){
			var word = item.get('word');
			var wordId = word.get('id');
			var wordToLearn = wordsDictionary[wordId];
			if(!wordToLearn){
				wordToLearn = wordsDictionary[wordId] = Vocabulary.WordToLearn.create({ 
					word: word,
					bookWords: Ember.A(),
					//wordTranslations: null,
					cards: Ember.A()
				});
			}
			wordToLearn.addBookWord(item);
		});
		for(var wordId in wordsDictionary){
			wordsArr.push(wordsDictionary[wordId]);
		}

		// . filter data
		var DAY = 60*60*24*1000;
		var now = Date.now();
		wordsArr = $.grep(wordsArr, function(item){
			var learnedAt = item.get('learnedAt') || 0;
			return (now-learnedAt)>DAY;
		});

		// . get first 30
		return wordsArr.slice(0, 30);
	},
	setupController: function(controller, model){
		// . set wordsTranslations
		this.setWordTranslations(model.content);
		// . set model
		model = this.modelFor('book');
		this._super(controller, model);
		// . set session data
		var sessionWords = this.get('sessionWords');
		controller.set('sessionWords', sessionWords);
		// . request for additional word translations
		//this.requestWordTranslations(sessionWords,3,27);

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