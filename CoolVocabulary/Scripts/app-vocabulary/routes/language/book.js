Vocabulary.BookRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/book', { outlet: 'body' });
	},
	model: function(params){
		this.set('id', params.book_id);
		var language = this.modelFor('language');
		var book = this.store.peekRecord('book', params.book_id);
		if(!book){
			return this.store.query('book', {
				language: language.id,
				bookId: params.book_id
			});
		}else if(book.get('isLoaded')){
			return book;
		}else{
			return this.store.findRecord('book', params.book_id);
		}
	},
	setupController: function(controller, model){
		var self = this;
		model = model && model.id?
			model:
			this.store.peekRecord('book', this.get('id'));
		$.cookie('currentBook', model.id);
		this._super(controller, model);
	}
});