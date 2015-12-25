Vocabulary.BookEditRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/book/edit', { into:'language/book', outlet: 'content' });
	}
});