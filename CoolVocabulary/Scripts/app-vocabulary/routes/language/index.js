Vocabulary.LanguageIndexRoute = Ember.Route.extend({
	model: function(){
		var language = this.modelFor('language');
		var books = this.store.peekAll('book').filterBy('language', language.id);
		if(books.get('length')){
			return books;
		}
		return this.store.query('book', {
			language: language.id,
			bookId: 0
		});
	},
	afterModel: function(books, transition) {
		var book;
		var languageId = this.modelFor('language').id;
		var currentBookId = $.cookie('currentBook_'+languageId);
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