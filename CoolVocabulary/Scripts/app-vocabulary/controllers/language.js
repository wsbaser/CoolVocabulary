Vocabulary.LanguageController = Ember.Controller.extend({
	applicationCtrl: Ember.inject.controller('application'),
	languages: Ember.computed('model', function(){
		// . return list of all languages except selected one
		var model = this.get('model');
		var nativeLanguage = this.get('applicationCtrl').get('user').nativeLanguage;
		return this.store.peekAll("language").filter(function(language){
			return language.id!==model.id && language.id!==nativeLanguage;
		});
	})
});