Vocabulary.Translation = DS.Model.extend({
    bookWord: DS.belongsTo("bookWord"),
    value: DS.attr("string"),
    language: DS.attr("string"),
    learnLevel: DS.attr("number"),
    examinedAt: DS.attr("number")
});