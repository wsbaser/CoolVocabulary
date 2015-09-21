Vocabulary.Book = DS.Model.extend({
    name: DS.attr("string"),
    language: DS.attr("string"),
    bookWords: DS.hasMany("bookWord")
});