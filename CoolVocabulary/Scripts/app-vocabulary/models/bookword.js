Vocabulary.BookWord = DS.Model.extend({
    book: DS.belongsTo("book"),
    word: DS.belongsTo("word"),
    speachPart: DS.attr("number"),
    learnedAt: DS.attr("number"),
    translations: DS.hasMany("translation"),
    learnLevel: Ember.computed("translations.[]", function(){
    	var level=0;
    	var learnLevels = this.get('book.userBook.learnLevels');
    	if(learnLevels){
			level = MAX_LEARN_LEVEL;
			this.get('translations').forEach(function(item){
				var translationLevel = learnLevels[item.id] || 0;
				if(translationLevel<level){
					level = translationLevel;
				}
			});
    	}
		return level;
    }),
	learnCompleted: Ember.computed('learnLevel', function(){
		var learnLevel = this.get('learnLevel')||0; 
		return learnLevel===MAX_LEARN_LEVEL;
	})
});