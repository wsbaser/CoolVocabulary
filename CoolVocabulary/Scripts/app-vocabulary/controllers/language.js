Vocabulary.LanguageController = Ember.Controller.extend({
	applicationCtrl: Ember.inject.controller('application'),
	languages: Ember.computed('model', function(){
		// . return list of all languages except selected one
		var currentLanguageId = this.get('model.id');
		var nativeLanguageId = this.get('applicationCtrl.model.nativeLanguage.id');
		return this.store.peekAll("language").filter(function(language){
			return language.id!==currentLanguageId && language.id!==nativeLanguageId;
		});
	})
});