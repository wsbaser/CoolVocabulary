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
        self.addTranslationToBook(data.userBook, data.book, data.bookWord, data.translation);
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
    if(this.user && this.user.id===user.id){
        return;
    }
    this.user = this.aggregateUserData(user, languages);
    localStorage.isCVAuthenticated = user!==null;
    this.reactor.dispatchEvent(CVService.CHECK_AUTH_END);
};

CVService.prototype.updateLanguageBooks = function(language, books){
    this.user.languagesData[language].books = books;

    this.aggregateTranslationsData(this.user.languagesData);
    this.user.hasUncompletedDE = this.hasAnyUncompletedDE(this.user.languagesData);
    this.reactor.dispatchEvent(CVService.USER_DATA_UPDATED);
};

CVService.prototype.addTranslationToBook = function(userBookDto, bookDto, bookWordDto, translationDto){
    var book = this.findLanguageBook(bookDto.language, bookDto.id);
    if(!book){
        book = this.addLanguageBook(userBookDto, bookDto);
    }
    if(!book.translations[bookWordDto.id]){
        book.translations[bookWordDto.id] = [];
    }
    book.translations[bookWordDto.id].push(translationDto.id);

    this.aggregateTranslationsData(this.user.languagesData);
    this.user.hasUncompletedDE = this.hasAnyUncompletedDE(this.user.languagesData);
    this.reactor.dispatchEvent(CVService.USER_DATA_UPDATED);    
};

CVService.prototype.findLanguageBook = function(language, id){
    var books = this.user.languagesData[language].books;
    return books.filter(function(book){ return book.id==id; })[0];
};

CVService.prototype.addLanguageBook = function(userBookDto, bookDto){
    var book = {
        id: bookDto.id,
        name: bookDto.name,
        language: bookDto.language,
        learnLevels: userBookDto.learnLevels,
        learnDates: userBookDto.learnDates,
        examDates: userBookDto.examDates,
        promoteDates: userBookDto.promoteDates,
        translations: userBookDto.translations
    };
    this.user.languagesData[book.language].books.push(book);
    return book;
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


CVService.prototype.parseBookJsonFields = function(languages){
    function tryParseJson(value){
        return value?
            (typeof value==='string'? JSON.parse(value) : value)
            :{};
    };
    for(var language in languages){
        var books = languages[language].books;
        books.forEach(function(book){
            book.learnLevels = tryParseJson(book.learnLevels);
            book.learnDates = tryParseJson(book.learnDates);
            book.examDates = tryParseJson(book.examDates);
            book.promoteDates = tryParseJson(book.promoteDates);
        });
    }
};

CVService.prototype.aggregateTranslationsData = function(languages){
    this.parseBookJsonFields(languages);

    // . calculate translations existance for each language
    for(var language in languages){
        languages[language].hasTranslations = this.booksHasTranslations(languages[language].books);
        if(languages[language].hasTranslations){
            languages[language].hasDE = this.deCalculator.hasDE(languages[language].books);
            languages[language].DENotCompleted = this.deCalculator.DENotCompleted(languages[language].books);
        }
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