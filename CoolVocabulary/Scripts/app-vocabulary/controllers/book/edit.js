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
			var self = this;
			BootstrapDialog.show({
	            title: 'Confirmation is neccessary',
	            message: 'Remove book?',
	            draggable: true,
	            size: BootstrapDialog.SIZE_SMALL,
	            buttons: [{
						label: 'Cancel',
						cssClass: 'modal-cancel',
		                action: function(dialog) {dialog.close();}
	            	},{
		                label: 'OK',
		                action: function(dialog){
							dialog.close();
							self.model.destroyRecord().then(function(){
								self.transitionToRoute('language.index');
							});
						}
	            	}]
	        	});
		}
	}
});