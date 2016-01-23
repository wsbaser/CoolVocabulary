function CVService(provider, services){
    this.config = provider.config;
    this.provider = provider;
    this.services = {};
    $.each(services, function(i, service){
        this.services[service.config.id] = service;
    }.bind(this));
    this.reactor = new Reactor();
    this.reactor.registerEvent(CVService.CHECK_AUTH_END);
    this.reactor.registerEvent(CVService.USER_DATA_UPDATED);
    this.deCalculator = new DECalculator();
}

CVService.CHECK_AUTH_END = 'authend';
CVService.USER_DATA_UPDATED = 'userdataupdated';

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
    var self = this;
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
    return this.provider.addTranslation(translationData).done(function(data){
        self.addTranslationToBook(data.book, data.translation);
    });
};

CVService.prototype.getBooks = function(language){
    return this.provider.getBooks(language);
};

CVService.prototype.checkAuthentication = function(){
    var self = this;
    return this.provider.checkAuthentication().done(function(data){
        self.setUser(data.user, data.languages);
    }).fail(function(){
        self.setUser(null);
    });
};

CVService.prototype.login = function(username, password){
    var self = this;
    return this.provider.login(username,password).done(function(data){
        self.setUser(data.user, data.languages);
    }).fail(function(){
        self.setUser(null);
    });
};

CVService.prototype.setUser = function(user, languages){
    this.user = this.aggregateUserData(user, languages);
    localStorage.isCVAuthenticated = user!==null;
    this.reactor.dispatchEvent(CVService.CHECK_AUTH_END);
};

CVService.prototype.updateLanguageBooks = function(language, books){
    this.user.languages[language].books = books;

    this.aggregateTranslationsData(this.user.languages);
    user.hasUncompletedDE = this.hasAnyUncompletedDE(languages);
    this.reactor.dispatchEvent(CVService.USER_DATA_UPDATED);
};

CVService.prototype.addTranslationToBook = function(bookDto, bookWordDto, translationDto){
    var language = book.language;
    var books = this.user.languages[language].books;
    var book = books.filter(function(book){ return book.id===bookDto.id; })[0];
    if(!book.translations[bookWordDto.id]){
        book.translations[bookWordDto.id] = [];
    }
    book.translations[bookWordDto.id].push(translationDto.id);

    this.aggregateTranslationsData(this.user.languages);
    user.hasUncompletedDE = this.hasAnyUncompletedDE(languages);
    this.reactor.dispatchEvent(CVService.USER_DATA_UPDATED);    
};

CVService.prototype.aggregateBooksByLanguage = function(books, languages){
    var languagesData = {};
    // . aggregate books by language
    books.forEach(function(book){
        if(!languagesData[book.language]){
            languagesData[book.language] = {books:[]};
        }
        languagesData[book.language].books.push(book);
    });
    for (var i = languages.length - 1; i >= 0; i--) {
        var language = languages[i];
        if(languagesData[language.id]){
            languagesData[language.id].languageName = language.name;
        }
    };
    return languagesData;
};

CVService.prototype.aggregateTranslationsData = function(languages){
    // . calculate translations existance for each language
    for(var language in languages){
        languages[language].hasTranslations = this.booksHasTranslations(languages[language].books);
    }

    // . calculate DE status
    for(var language in languages){
        languages[language].hasDE = this.deCalculator.hasDE(languages[language].books);
        languages[language].DENotCompleted = this.deCalculator.DENotCompleted(languages[language].books);
    }
};

CVService.prototype.hasAnyUncompletedDE = function(languages){
    for(var language in languages){
        if(languages[language].hasDE && languages[language].DENotCompleted){
            return true;
        }
    }
    return false;
};

CVService.prototype.aggregateUserData = function(user, languages){
    if(user===null){
        return null;
    }
    var languagesData = this.aggregateBooksByLanguage(user.books, languages);

    this.aggregateTranslationsData(languagesData);
    user.languagesData = languagesData;
    user.hasUncompletedDE = this.hasAnyUncompletedDE(languagesData);
    delete user.books;
    return user;
};

CVService.prototype.booksHasTranslations = function(books){
    for (var i = books.length - 1; i >= 0; i--) {
        if(Object.keys(books[i].translations).length){
            return true;
        }
    };
    return false;
};