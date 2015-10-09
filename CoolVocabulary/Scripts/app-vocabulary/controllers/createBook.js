Vocabulary.CreateBookController = Ember.Controller.extend({
	actions: {
		createBook: function(){
			var self = this;
			console.log('create book action called');
			this.model.save().then(function(createdBook){
				console.log('book saved');
				self.transitionToRoute('book', createdBook);
			}, function(error){
				console.log(error);
			});
		},
		cancel: function(){
			console.log('cancel');
			window.history.go(-1);
		}
	}
});