Vocabulary.ApplicationRoute = Ember.Route.extend({
	model: function(){
		var self = this;
		// . push server injected data into the store
		// ServerData.Languages.forEach(function(item){
		// 	self.store.push(self.store.normalize('language', item));
		// });
		self.store.pushPayload({
			languages:ServerData.Languages
		});
		self.store.pushPayload({
			users:[ServerData.User]
		});
			// self.store.normalize('user', ServerData.User));
		// . return curent User as application route model
		return self.store.find('user', ServerData.User.id);
	},
	setupController: function(controller, model){
		this._super(controller, model);

		// . store CCSRF Token in application controller 
		controller.set('csrfFormToken', ServerData.CSRFFormToken);

		// . create reactor and register events
		var reactor = new Reactor();
    	reactor.registerEvent('showBackground');
    	controller.set('reactor', reactor);

		// . navigate to language
		var language;
		var currentLanguageId = $.cookie('currentLanguage');
		var nativeLanguageId = model.get('nativeLanguage.id');
		if(currentLanguageId && currentLanguageId!==nativeLanguageId){
			// . get current language from  cookie if it is NOT native
			language = this.store.peekAll('language').findBy('id', currentLanguageId);
		}
		if(!language){
			// .get first NOT native
			language = this.store.peekAll('language').filter(function(item){
				return item.id!==nativeLanguageId;
			}).get('firstObject');
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