Vocabulary.ApplicationRoute = Ember.Route.extend({
	model: function(){
		var self = this;
		ServerData.Languages.forEach(function(item){
			self.store.push(self.store.normalize('language', item));
		});
	},
	setupController: function(controller, model){
		// . retrieve and store data from server side 
		controller.set('user', ServerData.User);
		controller.set('csrfFormToken', ServerData.CSRFFormToken);
		// . navigate to language
		var language;
		var currentLanguageId = $.cookie('currentLanguage');
		if(currentLanguageId){
			language = this.store.peekAll('language').findBy('id', currentLanguageId);
		}
		if(!language){
			language = this.store.peekAll('language').get('firstObject');
		}
		this.transitionTo('language', language);
	}
});