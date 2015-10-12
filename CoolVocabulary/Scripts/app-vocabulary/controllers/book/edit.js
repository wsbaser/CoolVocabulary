Vocabulary.BookEditController = Ember.Controller.extend({
	actions: {
		save: function(){
			var self = this;
			this.model.save().then(function(savedBook){
				self.transitionToRoute('book', savedBook.get('id'));
			});
		},
		cancel: function(){
			this.transitionToRoute('book');
		},
		delete: function(){
			this.model.destroyRecord();
		}
	}
});