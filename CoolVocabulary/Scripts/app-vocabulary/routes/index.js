Vocabulary.IndexRoute = Ember.Route.extend({
	model: function(params){
		var currentLanguage = $.cookie('currentLanguage');
		return currentLanguage || 'en';
	},
	afterModel: function(language, transition) {
		this.transitionTo('language', language);
  	}
});