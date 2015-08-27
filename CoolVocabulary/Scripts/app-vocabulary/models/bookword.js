Vocabulary.BookWord = DS.Model.extend({
    id: DS.attr("int"),
    book: DS.belongsTo("book"),
    word: DS.belongsTo("word"),
    learnProgress: DS.attr("int"),
    translations: DS.hasMany("translation")
});