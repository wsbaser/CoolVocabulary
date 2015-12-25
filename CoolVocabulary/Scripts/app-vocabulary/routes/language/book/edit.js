Vocabulary.BookEditRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/book/edit', { into: 'application', outlet: 'body' });
	}
});