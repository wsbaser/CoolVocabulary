Vocabulary.LanguageController = Ember.Controller.extend({
	languages: Ember.computed(function(){
		// . return list of all languages except selected one
		var model = this.get('model');
		return this.store.peekAll("language").filter(function(language){
			return language.id!==model.id;
		});
	})
});