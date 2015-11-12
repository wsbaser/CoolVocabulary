Vocabulary.Book = DS.Model.extend({
    name: DS.attr("string"),
    language: DS.attr("string"),
    wordsCount: DS.attr("number"),
    wordsCompletedCount: DS.attr("number"),
    bookWords: DS.hasMany("bookWord"),
    isLoaded: DS.attr('boolean')
});