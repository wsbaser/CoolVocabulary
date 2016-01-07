Vocabulary.WordTranslationController = Ember.Controller.extend({
	actions: {
		remove: function(){
			var self = this;
			BootstrapDialog.show({
	            title: 'Confirmation is neccessary',
	            message: 'Word will be removed.',
	            draggable: true,
	            size: BootstrapDialog.SIZE_SMALL,
	            buttons: [{
						label: 'Cancel',
						cssClass: 'modal-cancel',
		                action: function(dialog) {dialog.close();}
	            	},{
		                label: 'OK',
		                action: function(dialog) {
							dialog.close();
							self.transitionToRoute('book');
							self.get('model').destroyRecord();
						}
	            	}],
	        	onhidden: function(){
                	self.actions.hideWordDetails.call(self);
    			}});
		},
		move: function(){
			console.log('move word to another book');
		},
		hideWordDetails: function(){
			var mouseOverEl = document.elementFromPoint(this.clientX, this.clientY);
			if(mouseOverEl.closest('#word_details_popover') ||
				mouseOverEl.closest('.active') ||
				mouseOverEl.closest('.modal-backdrop') ||
				mouseOverEl.closest('.modal')){
				return;
			}
			$('#word_details_popover').removeClass('fadein').addClass('fadeout');
			this.transitionToRoute('book');
		},
		translationRemoved: function(){
			if(this.get('model.translations').toArray().length){
				this.actions.hideWordDetails.call(this);
			}
			else{
				this.transitionToRoute('book');
				this.get('model').destroyRecord();				
			}
		},
		saveMousePosition: function(event){
			this.clientX = event.clientX;
			this.clientY = event.clientY;
			this.actions.hideWordDetails.call(this);
		}
	}
});