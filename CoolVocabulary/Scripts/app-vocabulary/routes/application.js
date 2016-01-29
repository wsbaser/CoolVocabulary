Vocabulary.ApplicationRoute = Ember.Route.extend({
	model: function(){
		var self = this;
		// . push server injected data into the store
		// ServerData.Languages.forEach(function(item){
		// 	self.store.push(self.store.normalize('language', item));
		// });
			// self.store.normalize('user', ServerData.User));
		// . return curent User as application route model
		this.pushLanguages(ServerData.Languages);
		this.pushUser(ServerData.User);
		return self.store.peekRecord('user', ServerData.User.id);
	},
	pushLanguages: function(languages){
		this.store.pushPayload({
			languages: languages
		});
	},
	pushUser: function(user){
		this.store.pushPayload({
			users:[user]
		});
	},
	setupController: function(controller, model){
		this._super(controller, model);
		
		// . store CCSRF Token in application controller 
		controller.set('csrfFormToken', ServerData.CSRFFormToken);

		// . create reactor and register events
    	controller.set('reactor', this.initReactor());
	
		// . authenticate CT
	    controller.authenticateCT();

  		Ember.run.schedule('afterRender', this, this.afterRender);
		
		// . navigate to language
		this.navigateToLanguage(model);
	},
	initReactor: function(){
		var reactor = new Reactor();
    	reactor.registerEvent('showBackground');
    	reactor.registerEvent('ctAuthenticationEnd');
    	return reactor;
	},
	navigateToLanguage: function(user){
		var language;
		var currentLanguageId = $.cookie('currentLanguage');
		var nativeLanguageId = user.get('nativeLanguage.id');
		if(currentLanguageId && currentLanguageId!==nativeLanguageId){
			// . get current language from  cookie if it is NOT native
			language = this.store.peekAll('language').findBy('id', currentLanguageId);
		}
		if(!language){
			// .get first NOT native
			language = this.store.peekAll('language').filter(function(item){
				return item.id!==nativeLanguageId;
			}).get('firstObject');
			currentLanguageId = language.id;
		}
		this.transitionTo('language', currentLanguageId);
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
	},
	actions:{
		logout: function(){
			var ctAdapter = this.controller.get('CTAdapter');
			ctAdapter.logout();
			window.logoutForm.submit();
		}
	}
});