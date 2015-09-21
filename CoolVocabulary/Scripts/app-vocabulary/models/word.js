Vocabulary.Word = DS.Model.extend({
    value: DS.attr("string"),
    language: DS.attr("string"),
    pronunciation: DS.attr("string"),
    soundUrls: DS.attr("string"),
    pictureUrls: DS.attr("string"),
    bookWord: DS.belongsTo("bookWord")
});