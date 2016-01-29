Vocabulary.LanguageRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('menu', { outlet: 'menu' });
		this.render('language', { outlet: 'body' });
	},
	model: function(params){
		this.language = this.store.peekAll('language').findBy('id', params.language_id);
		if(!this.language){
			window.location="/";
		}
		return this.store.query('userBook',{ 
			language: this.language.id
		});
	},
  	setupController: function(controller, userBooks){
  		this._super(controller, this.language);
		$.cookie('currentLanguage', this.language.id);

		// . setup height adjusting
  		Ember.run.schedule('afterRender', this, this.afterRender);

  		// . setup background
  // 		var applicationCtrl = this.controllerFor('application');
  // 		var applicationReactor = applicationCtrl.get('reactor');
  // 		applicationReactor.addEventListener('showBackground', this.showBackground.bind(this));
		// setTimeout(this.activateBackground.bind(this), 10000);		
  	},
  	activateBackground: function(){
  		var self = this;
  		$(window.background).css('opacity', 1);
  		setTimeout(function(){
	  		self.isBackgroundActive = true;
  		}, 5000);
  	},
  	showBackground: function(){
  		var self = this;
  		if(self.isBackgroundActive && !self.isBackgroundShown){
	  		self.isBackgroundShown = true;
	  		var $page = $(window.page);
	  		// . set overflow to hidden for #page parent
	  		$page.parent().css('overflow', 'hidden');
	  		// . calculate top offset for #page
	  		var offset = parseInt($page.css('min-height'))-43;
	  		// . set top offset for #page
	  		$page.css('top', offset+'px');
	  		window.setTimeout(function(){
	  			$page.css('top', 0);
	  			setTimeout(function(){
		  			$page.parent().css('overflow', 'auto');
		  			self.isBackgroundShown = false;
	  			},500);
	  		}, 3000);
  		}
  	},
	afterRender: function(){
		var self = this;
		$(window).resize(function(){
			self.actions.adjustHeight.call(self);
		}.bind(self));
		self.actions.adjustHeight.call(self);
	},
	actions: {
		adjustHeight: function(){
			try{
				var menuHeight = $('#logo_mobile:visible').length?76:96;
				var height = $(window).height() - menuHeight;
				this.controller.set('contentHeight', Math.max(height, window.page.scrollHeight));
			}
			catch(error){
				console.error(this);
			}
		}
	}
});