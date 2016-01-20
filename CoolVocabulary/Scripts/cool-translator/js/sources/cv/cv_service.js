function CVService(provider, services){
    this.config = provider.config;
    this.provider = provider;
    this.services = {};
    $.each(services, function(i, service){
        this.services[service.config.id] = service;
    }.bind(this));
    this.reactor = new Reactor();
    this.reactor.registerEvent(CVService.CHECK_AUTH_END);
}

CVService.CHECK_AUTH_END = 'authend';

/* protected methods */

CVService.prototype.addEventListener = function(eventType, handler){
    this.reactor.addEventListener(eventType, handler)
};

CVService.prototype.getPronunciation = function(inputData, method){
    return this.services.tfd.getPronunciation(inputData);
};

CVService.prototype.getSoundUrls = function(inputData, translation){
    var all = [];
    $.each(this.services, function(i, service){
        all = all.concat(service.getSoundUrls(inputData, translation));
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

CVService.prototype.getTranslations = function(inputData, translation, activeSourceId){
    // . collect ALL translations
    var sourceToTranslations = {};
    $.each(this.services, function(i, service){
        var wordToTranslations = service.getTranslations(inputData);
        if(wordToTranslations){
            sourceToTranslations[service.config.id] = wordToTranslations;
        }
    });
    // . define the SOURCE WORD
    //   - it is a word for wich we want to add a translation
    var sourceWord;
    var activeSourceTranslations = sourceToTranslations[activeSourceId];
    for (var word in activeSourceTranslations) {
        var translations = activeSourceTranslations[word];
        for(var sp in translations){
            if(translations[sp].indexOf(translation)!=-1){
                sourceWord = word;
                break;
            }
        }
        if(sourceWord)
            break;
    };
    // . assemble ALL translations for SOURCE WORD from different sources
    var allTranslations = {};
    var allTranslationsArr = [];
    var unknownTranslationsArr = [];
    $.each(sourceToTranslations, function(sourceId, wordToTranslations){
        var sourceWordTranslations = wordToTranslations[sourceWord];
        if(sourceWordTranslations){ 
            $.each(sourceWordTranslations, function(speachPart, words){
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
    if(unknownTranslationsArr.length){
        allTranslations[SpeachParts.UNKNOWN] = unknownTranslationsArr;
    }
    return JSON.stringify(allTranslations);
};

/* public methods */

CVService.prototype.addTranslation = function(inputData, translation, sourceId, bookId){
    var translationData = {
        word: inputData.word,
        wordLanguage: inputData.sourceLang,
        wordPronunciation: this.getPronunciation(inputData),
        wordSoundUrls: this.getSoundUrls(inputData, translation),
        wordPictureUrls: this.getPictureUrls(inputData),
        bookId: bookId || 0,
        translationWord: translation,
        translationLanguage:  inputData.targetLang,
        translationWords: this.getTranslations(inputData, translation, sourceId),
        translationCards: this.getTranslationCards(inputData)
    };
    return this.provider.addTranslation(translationData);
};

CVService.prototype.getBooks = function(language){
    return this.provider.getBooks(language);
};

CVService.prototype.checkAuthentication = function(){
    var self = this;
    var deferred = $.Deferred();
    this.provider.checkAuthentication().done(function(user){
        self.user = user;
        self.reactor.dispatchEvent(CVService.CHECK_AUTH_END);
        deferred.resolve(user);
    }).fail(function(error){
        self.user = null;
        self.reactor.dispatchEvent(CVService.CHECK_AUTH_END);        
        deferred.reject(error);
    });
    return deferred.promise();
};

CVService.prototype.login = function(username, password){
    var promise = this.provider.login(username,password);
    promise.done(function(){
        localStorage.isCVAuthenticated = true;
    });
    return promise;
}