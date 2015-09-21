Vocabulary.WordTranslations = DS.Model.extend({
    word: DS.attr("string"),
    wordLanguage: DS.attr("string"),
    translationLanguage: DS.attr("string"),
    translationWords: DS.attr("string"),
    translationCards: DS.attr("string")
});