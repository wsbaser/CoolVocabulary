Vocabulary.BookLoadingRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('loading', { outlet: 'body'});
	}
});