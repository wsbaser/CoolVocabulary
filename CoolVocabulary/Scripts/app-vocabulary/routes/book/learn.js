Vocabulary.BookLearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/learnToolbox', {outlet:'toolbox'});
		this.render('book/learn', {outlet:'content'});
	},
	setupController: function(controller, model){
		this._super(controller, model);
	    Ember.run.schedule('afterRender', this, function() {
	    	console.log('bind scroll');
	    	$('#content').addClass('grey');
	    	$('#toolbox').addClass('grey');
	      	$('body').on('mousewheel', function(event){
				console.log(event.originalEvent.wheelDeltaY);
				if(event.originalEvent.wheelDeltaY<0) {
					$('#learning-cards-shadow').scrollTo('+=300px', 300);
					$('#learning-cards').scrollTo('+=300px', 300);
				} else {
					$('#learning-cards-shadow').scrollTo('-=300px', 300);
					$('#learning-cards').scrollTo('-=300px', 300);
				}
	      	});
	    });
	}
});