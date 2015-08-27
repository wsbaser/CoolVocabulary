Vocabulary.Book = DS.Model.extend({
    id: DS.attr.("int"),
    userID: DS.attr.("int"),
    name: DS.attr.("string"),
    language: DS.attr.("string"),
    bookWords: DS.hasMany("bookWord",{async:true})
});