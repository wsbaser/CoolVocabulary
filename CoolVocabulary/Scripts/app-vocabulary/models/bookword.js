Vocabulary.BookWord = DS.Model.extend({
    book: DS.belongsTo("book"),
    word: DS.belongsTo("word"),
    speachPart: DS.attr("number"),
    learnedAt: DS.attr("number"),
    checkedAt: DS.attr("number"),
    translations: DS.hasMany("translation")
});