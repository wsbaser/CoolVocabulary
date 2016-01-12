Vocabulary.BookRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/book', { outlet: 'body' });
	},
	model: function(params){
		this.set('id',params.userBook_id);
		var language = this.modelFor('language');
		var userBook = this.store.peekRecord('userBook', params.userBook_id);
		if(!userBook){
			this.transitionTo('application');
		}
		if(userBook.get('book.loaded')){
			return userBook;
		}else{
			return this.store.query('book', {
				id: userBook.get('book.id')
			});
		}
	},
	setupController: function(controller, model){
		var self = this;
		model = model && model.id?
			model:
			this.store.peekRecord('userBook', this.get('id'));
		model.set('book.loaded', true);
		var languageId = this.modelFor('language').id;
		$.cookie('currentUserBook_' + languageId, model.id);
		this._super(controller, model);
	}
});