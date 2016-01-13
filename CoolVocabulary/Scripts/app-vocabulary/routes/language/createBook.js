Vocabulary.CreateBookRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/createBook', { into: 'application', outlet: 'body' });
	},
	model: function(){
		var language = this.controllerFor('language').get('model');
		return this.store.createRecord('book',{
			language: language.id
		});
	}
});