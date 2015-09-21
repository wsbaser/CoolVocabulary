Vocabulary.LearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/learnToolbox', {outlet:'toolbox'});
		this.render('book/learn',{outlet:'content'});
	}
});