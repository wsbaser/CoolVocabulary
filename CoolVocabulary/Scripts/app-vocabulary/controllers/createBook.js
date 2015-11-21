Vocabulary.CreateBookController = Ember.Controller.extend({
	actions: {
		createBook: function(){
			var self = this;
			var result = this.model.save().then(function(createdBook){
				self.transitionToRoute('book', createdBook);
			}, function(error){
				console.log(error);
			});
		},
		cancel: function(){
			window.history.go(-1);
		}
	}
});