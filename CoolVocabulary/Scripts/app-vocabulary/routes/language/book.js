Vocabulary.BookRoute = Ember.Route.extend({
	renderTemplate: function() {
		this.render('language/book', { outlet: 'page' });
	},
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
		Ember.run.schedule('afterRender', this, this.afterRender);
	
	},
	afterRender: function(){
		var self = this;
		$(window).resize(function(){
			self.setContentHeight();
		}.bind(this));
		self.setContentHeight();
	},
	setContentHeight: function(){
		var controller = this.controllerFor('book');
		var menuHeight = $('#logo_mobile:visible').length?50:70;
		var height = $(window).height()-$('#toolbox').height()-10-menuHeight;
		controller.set('contentHeight', height);
		//$('#content').css('min-height', height+'px');
	}
});

Vocabulary.BookLoadingRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('loading', {outlet: 'page'});
	}
});