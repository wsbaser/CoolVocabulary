Vocabulary.BookExamRoute = Ember.Route.extend({
	renderTemplate: function(){
		// . do not render anything here
	},
	model: function(){
		this.userBook = this.controllerFor('book').get('model');
		var languageCtrl = this.controllerFor('language');
		var learnSessionWords = languageCtrl.get('learnSessionWords');
		if(learnSessionWords){
			languageCtrl.set('learnSessionWords', null);
			return this.getSessionTranslationsForLearnSessionWords(languageCtrl, learnSessionWords, this.userBook);
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
	getSessionTranslationsForLearnSessionWords: function(languageCtrl, learnSessionWords, userBook){
		var translationIds = [];
		learnSessionWords.forEach(function(sessionWord){
			sessionWord.get('bookWords').forEach(function(bookWord){
				bookWord.get('translations').forEach(function(translation){
					translationIds.push(translation.get('id'));
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
	},
	setupController: function(controller, model){
		controller.set('options', Ember.Object.create({
			userBook: this.controllerFor('book').get('model')
		}));
		this._super(controller, model);
	}
});