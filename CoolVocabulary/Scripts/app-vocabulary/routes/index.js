Vocabulary.IndexRoute = Ember.Route.extend({
	model: function(params){
		return this.store.query('book', {
			language: 0,
			bookId: 0
		});
	},
	afterModel: function(books, transition) {
		var model;
		var currentBookId = $.cookie('currentBook');
		if(currentBookId){
			// . get current book
			model = books.findBy('id', currentBookId);
		}
		if(!model){
			// .get first book
			model = books.get('firstObject');
		}
		this.transitionTo('book', model);
  	}
});

Vocabulary.LoadingRoute = Ember.Route.extend({
	renderTemplate: function(){
	    Ember.run.schedule('afterRender', this, this.afterRender);
		this._super();
	},
	afterRender: function(){
		var height = $(window).height()-Math.ceil($('.topbar').height());
		$('.loader-panel').css('height', height+'px');
	}
});