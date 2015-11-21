Vocabulary.BookRoute = Ember.Route.extend({
	model: function(params){
		this.set('id', params.book_id);
		var book = this.store.peekRecord('book', params.book_id);
		if(!book){
			return this.store.query('book', {
				language: 0,
				bookId: params.book_id
			});
		}else if(book.get('isLoaded')){
			return book;
		}else{
			return this.store.find('book', params.book_id);
		}
	},
	setupController: function(controller, model){
		model = model && model.id?
			model:
			this.store.peekRecord('book', this.get('id'));
		$.cookie('currentBook', model.id);
		this._super(controller, model);
	}
});

Vocabulary.BookLoadingRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('loading', {outlet: 'content'});
	}
});