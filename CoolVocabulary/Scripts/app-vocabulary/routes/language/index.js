Vocabulary.LanguageIndexRoute = Ember.Route.extend({
	model: function(){
		var language = this.modelFor('language');
		var currentBookId = $.cookie('currentBook') || 0;
		var books = this.store.peekAll('book');
		if(books.get('length')){
			return books;
		}
		return this.store.query('book', {
			language: language.id,
			bookId: currentBookId
		});
	},
	afterModel: function(books, transition) {
		var book;
		var currentBookId = $.cookie('currentBook');
		if(currentBookId){
			// . get current book
			book = books.findBy('id', currentBookId);
		}
		if(!book){
			// .get first book
			book = books.get('firstObject');
		}
		this.transitionTo('book', book);
  	}
});

// Vocabulary.LanguageLoadingRoute = Ember.Route.extend({
// 	renderTemplate: function(){
// 	    Ember.run.schedule('afterRender', this, this.afterRender);
// 		this._super();
// 	},
// 	afterRender: function(){
// 		var menuHeight = $('#logo_mobile:visible').length?50:70;
// 		var height = $(window).height()-menuHeight;
// 		$('.loader-panel').css('height', height+'px');
// 	}
// });