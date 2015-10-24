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
		return book;
	},
	getSessionWords: function(book){
		// // . agregate data
		// var wordsDictionary = {};
		// var wordsArr = [];
		// book.get('bookWords').forEach(function(item){
		// 	var word = item.get('word');
		// 	var wordId = word.get('id');
		// 	var wordToLearn = wordsDictionary[wordId];
		// 	if(!wordToLearn){
		// 		wordToLearn = wordsDictionary[wordId] = Vocabulary.WordToLearn.create({ 
		// 			word: word,
		// 			bookWords: Ember.A(),
		// 			cards: Ember.A()
		// 		});
		// 	}
		// 	wordToLearn.addBookWord(item);
		// });
		// for(var wordId in wordsDictionary){
		// 	wordsArr.push(wordsDictionary[wordId]);
		// }

		// // . filter data
		// var DAY = 60*60*24*1000;
		// var now = Date.now();
		// wordsArr = $.grep(wordsArr, function(item){
		// 	var learnedAt = item.get('learnedAt') || 0;
		// 	return (now-learnedAt)>DAY;
		// });

		// // . get first 30
		// return wordsArr.slice(0, 30);
		return [];
	},
	setupController: function(controller, model){
		// // . set wordsTranslations
		// this.setWordTranslations(model.content);
		// // . set active word
		// controller.activateFirstWord();
		// . set model
		model = this.modelFor('book');
		this._super(controller, model);
		// . set session data
		controller.set('sessionWords', this.get('sessionWords'));
		
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