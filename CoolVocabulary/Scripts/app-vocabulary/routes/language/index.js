// Vocabulary.LanguageIndexRoute = Ember.Route.extend({
// 	model: function(params){
// 		return this.store.query('book', {
// 			language: params.language,
// 			bookId: 0
// 		});
// 	},
// 	afterModel: function(books, transition) {
// 		var model;
// 		var currentBookId = $.cookie('currentBook');
// 		if(currentBookId){
// 			// . get current book
// 			model = books.findBy('id', currentBookId);
// 		}
// 		if(!model){
// 			// .get first book
// 			model = books.get('firstObject');
// 		}
// 		this.transitionTo('book', model);
//   	}
// });

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