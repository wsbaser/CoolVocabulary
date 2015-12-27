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

		// . create reactor and register events
		var reactor = new Reactor();
    	reactor.registerEvent('showBackground');
    	controller.set('reactor', reactor);

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
  		Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
		$('.topbar, .body-wrap').on('click', this.showBackground.bind(this));
	},
	showBackground: function(event){
		var applicationCtrl = this.controllerFor('application');
		var target = event.target;
		if((target.closest('.topbar') && !target.closest('a')) ||
			target.classList.contains('body-wrap')){
			var reactor = applicationCtrl.get('reactor');
			reactor.dispatchEvent('showBackground');
		}
	}
});