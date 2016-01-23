Vocabulary.CreateBookController = Ember.Controller.extend({
	languageCtrl: Ember.inject.controller('language'),
	actions: {
		createBook: function(){
			var self = this;
			var result = this.model.save().then(function(createdBook){
				self.get('languageCtrl').updateLanguageBooksInCT();
				self.transitionToRoute('book', createdBook.get('userBook'));
			}, function(error){
				console.log(error);
			});
		},
		cancel: function(){
			this.get('model').destroyRecord();
			this.transitionToRoute('language');
		}
	}
});