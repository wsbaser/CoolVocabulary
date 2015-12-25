Vocabulary.LanguageRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('menu', { outlet: 'menu' });
		this.render('language', { outlet: 'body' });
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
  	},
  	setupController: function(controller, model){
  		this._super(controller, model);
  		Ember.run.schedule('afterRender', this, this.afterRender);
  	},
	afterRender: function(){
		var self = this;
		$(window).resize(function(){
			self.setContentHeight();
		}.bind(this));
		self.setContentHeight();
	},
	setContentHeight: function(){
		var controller = this.controllerFor('language');
		var menuHeight = $('#logo_mobile:visible').length?50:70;
		var height = $(window).height()-menuHeight;
		controller.set('contentHeight', height);
	}
});