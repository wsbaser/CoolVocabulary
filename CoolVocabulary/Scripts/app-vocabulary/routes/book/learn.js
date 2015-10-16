Vocabulary.BookLearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/learnToolbox', {outlet: 'toolbox'});
		this.render('book/learn', {outlet: 'content'});
	},
	setupController: function(controller, model){
		model = this.controllerFor('book').get('model');
		this._super(controller, model);
		controller.setupSession();
	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
	    $('#content').addClass('grey');
    	$('#toolbox').addClass('grey');
      	$('body').on('mousewheel', function(event){
			if(event.originalEvent.wheelDeltaY<0) {
				$('#learning-cards-shadow').scrollTo('+=300px', 300);
				$('#learning-cards').scrollTo('+=300px', 300);
			} else {
				$('#learning-cards-shadow').scrollTo('-=300px', 300);
				$('#learning-cards').scrollTo('-=300px', 300);
			}
      	});
	}
});