Vocabulary.BookExamRoute = Ember.Route.extend({
	renderTemplate: function(){
		// . do not render anything here
	},
	model: function(){
		this.userBook = this.controllerFor('book').get('model');
		var languageCtrl = this.controllerFor('language');
		var learnSessionWords = languageCtrl.get('learnSessionWords');
		if(learnSessionWords){
			return languageCtrl.getSessionTranslationsForLearnSessionWords(learnSessionWords, this.userBook);
		}
		else {
			var sessionTranslations = this.getSessionTranslations(languageCtrl, this.userBook);
			if(this.checkSessionTranslations(sessionTranslations)){
				return sessionTranslations;
			}else{
				this.transitionTo('book');
			}
		}
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
	},
	setupController: function(controller, model){
		controller.set('options', Ember.Object.create({
			userBook: this.userBook
		}));
		this._super(controller, model);
	},
	actions: {
		sessionChanged: function(){
    		this.refresh();
  		}
	}
});