Vocabulary.ApplicationController = Ember.Controller.extend({
	init: function(){
		this.set('CTAdapter', new CTAdapter());
		this._super();
	},
	authenticateCT: function(){
		var self = this;
		var ctAdapter = this.get('CTAdapter');
		var userParam = this.getUserForCT();
		var languagesParam = this.getLanguagesForCT();
		ctAdapter.authenticate(userParam,  languagesParam, function(){
			var reactor = self.get('reactor');
			reactor.dispatchEvent('ctAuthenticationEnd');
		});
	},
	getUserForCT: function(){
		var user = this.get('model');
		return {
			id: user.get('id'),
			name: user.get('displayName'),
			language: user.get('nativeLanguage.id'),
			books: []
		};
	},
	getLanguagesForCT: function(){
		return this.store.peekAll('language').map(function(language){
				return { 
					id: language.get('id'),
					name: language.get('name')
				};
			});
	}
});