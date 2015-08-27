Vocabulary.Translation = DS.Model.extend({
    id: DS.attr("int"),
    bookWord: DS.belongsTo("bookWord"),
    value: DS.attr("string"),
    language: DS.attr("language")
});