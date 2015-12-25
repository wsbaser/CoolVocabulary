Vocabulary.CreateBookRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/createBook', { outlet: 'body' });
	},
	model: function(){
		var language = this.modelFor('language');
		return this.store.createRecord('book',{
			language: language.id
		});
	}
});