function CVService(provider, services){
    this.config = provider.config;
    this.provider = provider;
    this.services = {};
    $.each(services, function(i, service){
        this.services[service.config.id] = service;
    }.bind(this));
}

/* private methods */
CVService.prototype._addWord = function(inputData, translation, vocabularyID){
    var word = {
        Value: inputData.word,
        Language: inputData.sourceLang,
        Pronunciation: this.getPronunciation(inputData),
        SoundUrls: this.getSoundUrls(inputData),
        PictureUrls: this.getPictureUrls(inputData)
    };
    var wordTranslation = {
        VocabularyID: vocabularyID,
        Translations: translation,
        TranslationsLanguage: getIndexByLang(inputData.targetLang)
    };
    return this.provider.addWord(word, wordTranslation);
};

CVService.prototype._addWordTranslations = function(inputData){
    return this.provider.addWordTranslations(inputData.sourceLang, inputData.targetLang, {
        Word: inputData.word,
        Translations: this.getTranslations(inputData),
        TranslationCards: this.getTranslationCards(inputData)
    });
};

/* public methods */
CVService.prototype.getTranslationCards = function(inputData){
    var translationCards = {};
    $.each(this.services, function(id, service){
        var cards = service.getCachedCards(inputData);
        if(cards)
            translationCards[service.config.id] = cards;
    });
    return JSON.stringify(translationCards);
};

CVService.prototype.addTranslation = function(inputData, translation, vocabularyID){
    var self = this;
    return this._addWord(inputData, translation, vocabularyID).then(function(){
        return self._addWordTranslations(inputData);
    });
};

CVService.prototype.getBooks = function(language){
    return this.provider.getBooks(language);
};

CVService.prototype.checkAuthentication = function(){
    return this.provider.checkAuthentication();
};

CVService.prototype.login = function(username, password){
    var promise = this.provider.login(username,password);
    promise.done(function(){
        localStorage.isCVAuthenticated = true;
    });
    return promise;
}

CVService.prototype.getTranslations = function(inputData){
    var allTranslations = {};
    var allTranslationsArr = [];
    $.each(this.services, function(i, service){
        var translations = service.getTranslations(inputData);
        if(translations){
            $.each(translations, function(speachPart, words){
                words = words.unique(allTranslationsArr);
                if(words.length){
                    allTranslationsArr = allTranslationsArr.concat(words);
                    var current = allTranslations[speachPart];
                    allTranslations[speachPart] = current ?
                        current.concat(words):
                        words;
                }
            });
        }
    });
    return JSON.stringify(allTranslations);
};

CVService.prototype.getPronunciation = function(inputData, method){
    return this.services.tfd.getPronunciation(inputData);
};

CVService.prototype.getSoundUrls = function(inputData){
    return this.services.ll.getSoundUrls(inputData);
};

CVService.prototype.getPictureUrls = function(inputData){
    var all = [];
    $.each(this.services, function(i, service){
        all = all.concat(service.getPictureUrls(inputData));
    });
    return all.join(',');
};
