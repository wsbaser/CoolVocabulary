Vocabulary.LanguageDERoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('language/book', { outlet: 'body' });
	},
	model: function(){
		this.set('transitionToLearn', false);
		var languageCtrl = this.controllerFor('language');
		var sessionItems = this.getSessionItems(languageCtrl);
		if(this.checkSessionItems(sessionItems)){
			return sessionItems;
		}
		else{
			this.transitionTo('book');
		}
	},
	checkSessionItems: function(sessionItems){
		if(!sessionItems || !sessionItems.length){
			var transitionToLearn = this.get('transitionToLearn');
			BootstrapDialog.alert({
			    title: 'Warning',
			    message: '<b>No translations to examine!</b><br><br>'+
					'Add new translations in your book or find a public book.'
			});
			return false;
		}
		return true;
	},
	requestTranslations: function(ids){
		return this.store.query('translation', { ids:ids });
	},
	requestBookWords: function(ids){
		return this.store.query('bookWord', { ids:ids });
	},
	getSessionBookWords: function(languageCtrl, waitingTranslationsIds){
		var waitingBookWordIds = languageCtrl.getBookWordsForTranslations(waitingTranslationsIds);
		waitingBookWordIds.shuffle();
		var waitingBookWords = languageCtrl.getBookWordsFromStore(waitingBookWordIds);
		if(waitingBookWords.length>=SESSION_WORDS_COUNT ||
			waitingBookWords.length===waitingBookWordIds.length){
			return waitingBookWords.slice(0, SESSION_WORDS_COUNT);
		}
		else{
			var sessionBookWordIds = waitingBookWordIds.slice(0, SESSION_WORDS_COUNT); 
			return this.requestBookWords(sessionBookWordIds);
			// var loadedBookWordIds = waitingBookWords.map(function(bookWord){return bookWord.id;});
			// var notLoadedTranslationIds = waitingBookWords.filter(function(id){
			// 	return loadedTranslationIds.indexOf(id)===-1;
			// });
		}
	},
	getSessionTranslations: function(languageCtrl, translationsInProgressIds){
		var sessionTranslationIds = languageCtrl.getSessionTranslations(translationsInProgressIds);
		var sessionTranslations = languageCtrl.getTranslationsFromStore(sessionTranslationIds);

		// . request translations from server if necessary
		if(sessionTranslations.length===SESSION_WORDS_COUNT ||
			sessionTranslations.length===sessionTranslationIds.length){
			return sessionTranslations;
		}else{
			// var loadedTranslationIds = sessionTranslations.map(function(translation){
			// 	return translation.id;
			// });
			// var notLoadedTranslationIds = sessionTranslations.filter(function(id){
			// 	return loadedTranslationIds.indexOf(id)===-1;
			// });
			return this.requestTranslations(sessionTranslationIds);
		}
	},
	getSessionItems: function(languageCtrl){
		// . get translations for examination from all books
		var active = languageCtrl.getAllActiveTranslations(); 

		// . make a decision whether to learn new or examinate existing translations
		if(active.inProgress.length<languageCtrl.get('thisMonthPlan.planedCount') && active.waiting.length){
			this.set('transitionToLearn', true);
			return this.getSessionBookWords(languageCtrl, active.waiting);
		}
		else if(active.inProgress.length){
			return this.getSessionTranslations(languageCtrl, active.inProgress);
		}
		return null;
	},
	afterModel: function(){
		if(this.get('transitionToLearn')){
			this.transitionTo('language.DE.learn');
		}else{
			// . transition to "index" by default
		}
	},
	actions:{
		error: function(){
			alert('DE error');
		},
		sessionChanged: function(){
    		this.refresh();
  		}
	}
});