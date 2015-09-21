Vocabulary.BookWord = DS.Model.extend({
    book: DS.belongsTo("book"),
    word: DS.belongsTo("word"),
    learnProgress: DS.attr("number"),
    translations: DS.hasMany("translation")
});