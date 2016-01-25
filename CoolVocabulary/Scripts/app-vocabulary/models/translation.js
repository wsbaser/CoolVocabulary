Vocabulary.Translation = DS.Model.extend({
    bookWord: DS.belongsTo("bookWord"),
    value: DS.attr("string"),
    language: DS.attr("string"),
    learnLevel: Ember.computed("bookWord.book.userBook.learnLevels", function(){
    	var learnLevels = this.get('bookWord.book.userBook.learnLevels'); 
		return learnLevels[this.get('id')]||0;
  	})
});