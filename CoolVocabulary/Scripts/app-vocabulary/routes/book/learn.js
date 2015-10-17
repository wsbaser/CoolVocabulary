Vocabulary.BookLearnRoute = Ember.Route.extend({
	renderTemplate: function(){
		this.render('book/learnToolbox', {outlet: 'toolbox'});
		this.render('book/learn', {outlet: 'content'});
	},
	// model: function(){
	// 	return this.store.query('word',{
	// 		ids: [1,2,3]
	// 	}).then(function(data){
	// 		console.log(data);
	// 	});
	// },
	setupController: function(controller, model){
		model = this.modelFor('book');
		this._super(controller, model);
		controller.setupSession();
	    Ember.run.schedule('afterRender', this, this.afterRender);
	},
	afterRender: function(){
		// . bind touch events here

   //    	$('body').on('mousewheel', function(event){
			// if(event.originalEvent.wheelDeltaY<0) {
			// 	$('#learning-cards-shadow').scrollTo('+=300px', 300);
			// 	$('#learning-cards').scrollTo('+=300px', 300);
			// } else {
			// 	$('#learning-cards-shadow').scrollTo('-=300px', 300);
			// 	$('#learning-cards').scrollTo('-=300px', 300);
			// }
   //    	});
	}
});