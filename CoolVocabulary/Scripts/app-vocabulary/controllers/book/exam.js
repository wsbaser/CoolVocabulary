Vocabulary.BookExamController = Ember.Controller.extend(Vocabulary.HasActiveObject, {
	collection: Ember.computed.alias('sessionWords'),
	activeWord: Ember.computed.alias('activeObject'),
	activateFirstWord: function(){
		this.activateFirstObject();
	},
	isLastWord: Ember.computed.alias('isLastObject'),
	actions: {
		nextWord: function(){
			var activeWord = this.get('activeWord');
			activeWord.set('isExamined', true);
			if(!this.nextObject()){
				this.transitionToRoute('book');
			}
		}
	}
});