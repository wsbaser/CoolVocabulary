Vocabulary.LanguageLoadingRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('loading', { outlet: 'body'});
		this.send('adjustHeight');
	}
});