Vocabulary.BookEditController = Ember.Controller.extend({
	actions: {
		save: function(){
			var self = this;
			this.model.get('book').content.save().then(function(savedBook){
				self.transitionToRoute('book', savedBook.get('userBook.id'));
			});
		},
		cancel: function(){
			this.transitionToRoute('book');
		},
		delete: function(){
			var self = this;
			BootstrapDialog.show({
	            title: 'Confirmation is neccessary',
	            message: 'Book will be removed.',
	            draggable: true,
	            size: BootstrapDialog.SIZE_SMALL,
	            buttons: [{
						label: 'Cancel',
						cssClass: 'modal-cancel',
		                action: function(dialog) { dialog.close(); }
	            	},{
		                label: 'OK',
		                action: function(dialog){
							dialog.close();
							var userBook = self.model; 
							var book = userBook.get('book');
							userBook.destroyRecord().then(function(){
								self.transitionToRoute('language.index');
							});
						}
	            	}]
	        	});
		}
	}
});