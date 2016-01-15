Vocabulary.LanguageController = Ember.Controller.extend({
	applicationCtrl: Ember.inject.controller('application'),
	user: Ember.computed.alias('applicationCtrl.model'),
	languages: Ember.computed('model', function(){
		// . return list of all languages except selected one
		var currentLanguageId = this.get('model.id');
		var nativeLanguageId = this.get('applicationCtrl.model.nativeLanguage.id');
		return this.store.peekAll("language").filter(function(language){
			return language.id!==currentLanguageId && language.id!==nativeLanguageId;
		});
	}),
	userBooks: Ember.computed('user.userBooks.[]', 'model', function(){
		var userBooks = this.get('user.userBooks');
		var languageId = this.get('model.id');
		return userBooks.filter(function(userBook){
			return userBook.get('book.language')===languageId; 
		});
	})
});