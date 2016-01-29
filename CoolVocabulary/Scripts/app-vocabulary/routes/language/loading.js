Vocabulary.LanguageLoadingRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('loading', { outlet: 'body'});
	}
});

// Vocabulary.ApplicationLoadingRoute = Ember.Route.extend({
// 	renderTemplate: function(){
// 		this.render('loading', { outlet: 'body'});
// 	}
// });