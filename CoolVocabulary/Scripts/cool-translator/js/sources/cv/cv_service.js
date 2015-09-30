function CVService(provider, services){
    this.config = provider.config;
    this.provider = provider;
    this.services = {};
    $.each(services, function(i, service){
        this.services[service.config.id] = service;
    }.bind(this));
}

/* protected methods */

CVService.prototype.getPronunciation = function(inputData, method){
    return this.services.tfd.getPronunciation(inputData);
};

CVService.prototype.getSoundUrls = function(inputData){
    var all = [];
    $.each(this.services, function(i, service){
        all = all.concat(service.getSoundUrls(inputData));
    });
    return all.join(',');
};

CVService.prototype.getPictureUrls = function(inputData){
    var all = [];
    $.each(this.services, function(i, service){
        all = all.concat(service.getPictureUrls(inputData));
    });
    return all.join(',');
};

CVService.prototype.getTranslationCards = function(inputData){
    var translationCards = {};
    $.each(this.services, function(id, service){
        var cards = service.getCachedCards(inputData);
        if(cards)
            translationCards[service.config.id] = cards;
    });
    return JSON.stringify(translationCards);
};

CVService.prototype.getTranslations = function(inputData){
    var allTranslations = {};
    var allTranslationsArr = [];
    var unknownTranslationsArr = [];
    $.each(this.services, function(i, service){
        var translations = service.getTranslations(inputData);
        if(translations){
            $.each(translations, function(speachPart, words){
                words = words.unique(allTranslationsArr);
                if(words.length){
                    if(speachPart==SpeachParts.UNKNOWN){
                        // add to unknown
                        words = words.unique(unknownTranslationsArr);
                        unknownTranslationsArr = unknownTranslationsArr.concat(words);
                    }
                    else {
                        // remove from unknown
                        unknownTranslationsArr = unknownTranslationsArr.unique(words);
                        allTranslationsArr = allTranslationsArr.concat(words);
                        var current = allTranslations[speachPart];
                        allTranslations[speachPart] = current ?
                            current.concat(words):
                            words;
                    }
                }
            });
        }
    });
    allTranslations[SpeachParts.UNKNOWN] = unknownTranslationsArr;
    return JSON.stringify(allTranslations);
};

/* public methods */

CVService.prototype.addTranslation = function(inputData, translation, bookId){
    var translationData = {
        word: inputData.word,
        wordLanguage: inputData.sourceLang,
        wordPronunciation: this.getPronunciation(inputData),
        wordSoundUrls: this.getSoundUrls(inputData),
        wordPictureUrls: this.getPictureUrls(inputData),
        bookId: bookId || 0,
        translationWord: translation,
        translationLanguage:  inputData.targetLang,
        translationWords: this.getTranslations(inputData),
        translationCards: this.getTranslationCards(inputData)
    };
    return this.provider.addTranslation(translationData);
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