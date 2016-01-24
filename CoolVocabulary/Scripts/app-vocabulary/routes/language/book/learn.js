Vocabulary.BookLearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		// . do not render anything here
	},
	model: function(params){
		var bookCtrl = this.controllerFor('book');
		this.isSingleWord =  +params.word_id!==0;
		if(this.isSingleWord){
			return this.getSessionBookWordsForWord(bookCtrl, params.word_id);
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
	getSessionBookWordsForWord: function(bookCtrl, wordId){
		return bookCtrl.get('model.book.bookWords').filterBy('word.id', wordId);
	},
	getSessionBookWords: function(bookCtrl){
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
		controller.set('options', Ember.Object.create({
			isSingleWord: this.isSingleWord,
			userBook: this.controllerFor('book').get('model')
		}));
		this._super(controller, model);
	},
	actions: {
		sessionChanged: function(){
    		this.refresh();
  		}
	}
});