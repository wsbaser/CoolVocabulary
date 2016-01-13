Vocabulary.LanguageIndexRoute = Ember.Route.extend({
	// model: function(){
	// 	var language = this.modelFor('language');
	// 	// var books = this.store.peekAll('userBook').filterBy('book.language', language.id);
	// 	// return this.store.find('userBook', this.currentBookId);
	// 	return this.store.query('userBook',{ 
	// 		language: language.id
	// 	});
	// },
	// afterModel: function(userBooks, transition) {
	// 	// . get current book id
	// 	var languageId = this.modelFor('language').id;
	// 	var currentBookId = $.cookie('currentBook_'+languageId);
	// 	var userBook;
	// 	if(currentBookId){
	// 		userBook = userBooks.findBy('id', currentBookId);
	// 	}
	// 	if(!userBook){
	// 		userBook = userBooks.get('firstObject');
	// 	}
	// 	this.transitionTo('book', userBook);
 //  	}
  	setupController: function(){
  		// . get user books for current language
  		var languageId = this.controllerFor('language').get('model.id');
  		var user = this.modelFor('application');
  		var userBooks = user.get('userBooks').filter(function(userBook){
			return userBook.get('book.language')===languageId; 
		});

		// . get current book id
		var userBook;
		var currentUserBookId = $.cookie('currentUserBook_' + languageId);
		if(currentUserBookId){
			userBook = userBooks.findBy('id', currentUserBookId);
		}
		if(!userBook){
			currentUserBookId = userBooks.get('firstObject.id');
		}
		this.transitionTo('book', currentUserBookId);
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