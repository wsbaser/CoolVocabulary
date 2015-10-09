Vocabulary.BookEditController = Ember.Controller.extend({
	actions: {
		save: function(){
			var self = this;
			this.model.save().then(function(savedBook){
				self.transitionToRoute('book', savedBook.get('id'));
			});
		},
		cancel: function(){
			console.log('cancel');
			window.history.go(-1);
		},
		delete: function(){
			this.model.destroyRecord();
		}
	}
});