Vocabulary.CreateBookRoute = Ember.Route.extend({
	model: function(){
		var applicationCtrl = this.controllerFor('application');
		return this.store.createRecord('book',{
			language: applicationCtrl.get('langPair').sourceLang
		});
	}
});