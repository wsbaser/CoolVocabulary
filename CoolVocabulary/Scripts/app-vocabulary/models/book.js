Vocabulary.Book = DS.Model.extend({
    name: DS.attr("string"),
    user: DS.attr("string"),
    language: DS.attr("string"),
    loaded: DS.attr("boolean"),
    bookWords: DS.hasMany("bookWord"),
    userBook: DS.belongsTo('userBook')
});