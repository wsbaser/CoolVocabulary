Vocabulary.BookWord = DS.Model.extend({
    book: DS.belongsTo("book"),
    word: DS.belongsTo("word"),
    speachPart: DS.attr("number"),
    learnedAt: DS.attr("number"),
    translations: DS.hasMany("translation"),
    learnLevel: Ember.computed("translations.[]", "book.userBook.learnDates", function(){
    	var learnDates = this.get('book.userBook.learnDates');
    	var bookWordId = this.get('id');
    	if(learnDates && learnDates[bookWordId]){
	    	var learnLevels = this.get('book.userBook.learnLevels');
			var level = MAX_LEARN_LEVEL;
			this.get('translations').forEach(function(item){
				var translationLevel = learnLevels[item.id] || 0;
				if(translationLevel<level){
					level = translationLevel;
				}
			});
			return level;
    	}
    	else{
    		return -1;
    	}
    }),
	learnCompleted: Ember.computed('learnLevel', function(){
		var learnLevel = this.get('learnLevel')||0; 
		return learnLevel===MAX_LEARN_LEVEL;
	})
});