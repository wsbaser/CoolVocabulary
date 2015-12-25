Vocabulary.LanguageRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('menu', { outlet: 'menu' });
	},
	model: function(params){
		return this.store.peekAll('language').findBy('id', params.language_id);
	},
	afterModel: function(language, transition) {
		if(!language){
			// . language not found 
			this.transitionTo('application');
		}
		$.cookie('currentLanguage', language.id);
		this._super();
  	}
});

Vocabulary.LanguageLoadingRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('loading', {outlet: 'page'});
	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
		var menuHeight = $('#logo_mobile:visible').length?50:70;
		var height = $(window).height()-menuHeight;
		$('.loader-panel').css('height', height+'px');
	}
});