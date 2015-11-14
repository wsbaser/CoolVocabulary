Vocabulary.BookRoute = Ember.Route.extend({
	model: function(params){
		return $.Deferred().promise();
		// this.set('id', params.book_id);
		// return this.store.query('book', {
		// 	language: 0,
		// 	bookId: params.book_id
		// });
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