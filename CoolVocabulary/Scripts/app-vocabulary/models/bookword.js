Vocabulary.BookWord = DS.Model.extend({
    book: DS.belongsTo("book"),
    word: DS.belongsTo("word"),
    speachPart: DS.attr("number"),
    learnedAt: DS.attr("number"),
    translations: DS.hasMany("translation"),
  //   init: function(){
  //   	if(this.get('word.value')){
  //   		this.updateLearnLevel();
  //   	}
  //   },
  //   initLearnLevel: Ember.observer('translations.[]', function(){
  //   	this.updateLearnLevel();
  //   }),
  //   updateLearnLevel: function(){
  //   	console.log(this.get('word.value'));
  //   	var level = MAX_LEARN_LEVEL;
		// this.get('translations').forEach(function(item){
		// 	var translationLevel = item.get('learnLevel') || 0;
		// 	if(translationLevel<level){
		// 		level = translationLevel;
		// 	}
		// });
		// this.set('learnLevel', level);
  //   },
    learnLevel: Ember.computed("translations.[]", function(){
    	var level = MAX_LEARN_LEVEL;
		this.get('translations').forEach(function(item){
			var translationLevel = item.get('learnLevel') || 0;
			if(translationLevel<level){
				level = translationLevel;
			}
		});
		return level;
    }),
	learnCompleted: Ember.computed('learnLevel', function(){
		return this.get('learnLevel')===MAX_LEARN_LEVEL;
	})
});