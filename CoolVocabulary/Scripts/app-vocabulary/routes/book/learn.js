Vocabulary.BookLearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/learnToolbox', {outlet: 'toolbox'});
		this.render('book/learn', {outlet: 'content'});
	},
	sessionWords: null,
	model: function(){
		var book = this.controllerFor('book').get('model');
		var sessionWords = this.getSessionWords(book);
		this.set('sessionWords', sessionWords);
		return this.requestWordTranslations(sessionWords, 0, 3);
	},
	afterModel: function(){
		var sessionWords = this.get("sessionWords");
		if(!sessionWords || !sessionWords.toArray().length){
			alert('Add words!');
			this.transitionTo('book');
		}
	},
	requestWordTranslations: function(sessionWords, start , count){
		var wordsRange = sessionWords.slice(start, start+count);
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
		var wordsDictionary = {};
		var wordsArr = [];
		var bookWords = book.get('bookWords').filterBy('learnCompleted', false)
		.sort(function(item1, item2){
			var time1 = item1.get('learnedAt') || 0;
			var time2 = item2.get('learnedAt') || 0;
			return time1>time2?1:(time1===time2?0:-1);
		}).toArray();
		var count=0;
		for(var i =0; i<bookWords.length&&count<30; i++){
			var word = bookWords[i].get('word');
			var wordId = word.get('id');
			var wordToLearn = wordsDictionary[wordId];
			if(!wordToLearn){
				wordToLearn = wordsDictionary[wordId] = Vocabulary.WordToLearn.create({ 
					word: word,
					bookWords: Ember.A(),
					cards: Ember.A()
				});
				count++;
			}
			wordToLearn.addBookWord(bookWords[i]);
		}
		for(var id in wordsDictionary){
			wordsArr.push(wordsDictionary[id]);
		}
		return wordsArr.shuffle();
	},
	setupController: function(controller, model){
		// . set wordsTranslations
		this.setWordTranslations(model.content);
		// . set model
		model = this.controllerFor('book').get('model');
		this._super(controller, model);
		// . set session data
		var sessionWords = this.get('sessionWords');
		controller.set('sessionWords', sessionWords);
		// . request for additional word translations
		if(sessionWords.length>3){
			this.requestWordTranslations(sessionWords, 3, 27).then(function(data){
				this.setWordTranslations(data.content);
			}.bind(this));
		}

	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
		// . set active word
		this.controller.activateFirstWord();
		
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