Vocabulary.Translation = DS.Model.extend({
    bookWord: DS.belongsTo("bookWord"),
    value: DS.attr("string"),
    speachPart: DS.attr("number"),
    language: DS.attr("string")
});