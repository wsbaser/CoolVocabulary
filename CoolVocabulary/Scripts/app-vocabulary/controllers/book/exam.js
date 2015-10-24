Vocabulary.BookExamController = Ember.Controller.extend(Vocabulary.HasActiveObject, {
	collection: Ember.computed.alias('sessionWords'),
	activeWord: Ember.computed.alias('activeObject'),
	activateFirstWord: function(){
		this.activateFirstObject();
	},
	isLastWord: Ember.computed.alias('isLastObject')
});