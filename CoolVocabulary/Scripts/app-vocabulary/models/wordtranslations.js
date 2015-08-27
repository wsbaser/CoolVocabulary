Vocabulary.WordTranslations = DS.Model.extend({
    id: DS.attr("string"),
    word: DS.attr("string"),
    wordLanguage: DS.attr("string"),
    translationLanguage: DS.attr("string"),
    translationWords: DS.attr("string"),
    translationCards: DS.attr("string")
});