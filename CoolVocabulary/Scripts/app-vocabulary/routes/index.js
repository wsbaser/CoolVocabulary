Vocabulary.IndexRoute = Ember.Route.extend({
	model: function(params){
		return this.store.query('book', {
			language: 0,
			bookId: 0
		});
	},
	afterModel: function(books, transition) {
		console.log('transition to book');
		var model = books.get('firstObject');
		this.transitionTo('book', model);
  	}
});