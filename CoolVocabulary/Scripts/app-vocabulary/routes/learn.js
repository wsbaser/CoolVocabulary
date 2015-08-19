Vocabulary.LearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('learnToolbox', {outlet:'toolbox'});
		this.render('learn',{outlet:'content'});
	}
});