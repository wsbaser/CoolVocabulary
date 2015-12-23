Vocabulary.BookEditRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('book/edit', { outlet: 'content' });
	}
});