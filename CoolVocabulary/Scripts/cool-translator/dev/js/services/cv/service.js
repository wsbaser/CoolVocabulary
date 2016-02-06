'use strict';

import DECalculator from './de-calculator';
import Reactor from 'reactor';
import SpeachParts from '../common/speach-parts';

export default class CVService {
    constructor(provider, services) {
        this.config = provider.config;
        this.provider = provider;
        this.services = {};
        $.each(services, function(i, service) {
            this.services[service.config.id] = service;
        }.bind(this));
        this.reactor = new Reactor();
        this.reactor.registerEvent(CVService.CHECK_AUTH_END);
        this.reactor.registerEvent(CVService.USER_DATA_UPDATED);
        this.deCalculator = new DECalculator();
    }

    //***** STATIC ****************************************************************************************************
    static get CHECK_AUTH_END(){
        return 'authend';
    }

    static get USER_DATA_UPDATED(){
        return 'userdataupdated';
    }

    //***** PRIVATE ***************************************************************************************************

    _getResolvedPromise(data) {
        let deferred = $.Deferred();
        deferred.resolve(data);
        return deferred.promise();
    }

    /* protected methods */

    addAuthEndListener(handler) {
        this.reactor.addEventListener(CVService.CHECK_AUTH_END, handler)
    }

    addUserDataUpdatedListener(handler) {
        this.reactor.addEventListener(CVService.USER_DATA_UPDATED, handler)
    }

    getPronunciation(inputData, method) {
        return this.services.tfd.getPronunciation(inputData);
    }
    
    getSoundUrls(inputData, translation) {
        let all = [];
        $.each(this.services, function(i, service) {
            all = all.concat(service.getSoundUrls(inputData, translation));
        });
        return all.join(',');
    }

    getPictureUrls(inputData) {
        let all = [];
        $.each(this.services, function(i, service) {
            all = all.concat(service.getPictureUrls(inputData));
        });
        return all.join(',');
    }

    getTranslationCards(inputData) {
        let translationCards = {};
        $.each(this.services, function(id, service) {
            let cards = service.getCachedCards(inputData);
            if (cards)
                translationCards[service.config.id] = cards;
        });
        return JSON.stringify(translationCards);
    }

    getSourceToTranslations(inputData) {
        // . collect ALL translations
        let sourceToTranslations = {};
        $.each(this.services, function(i, service) {
            let wordToTranslations = service.getTranslations(inputData);
            if (wordToTranslations) {
                sourceToTranslations[service.config.id] = wordToTranslations;
            }
        });
        return sourceToTranslations;
    }

    getSourceWord(activeSourceTranslations, translation) {
        // . define the SOURCE WORD
        //   - it is a word for wich we want to add a translation
        for (let word in activeSourceTranslations) {
            let translations = activeSourceTranslations[word];
            for (let sp in translations) {
                if (translations[sp].indexOf(translation) != -1) {
                    return word;
                }
            }
        };
        throw new Error('Unable to define source word.');
    }

    getTranslations(sourceToTranslations, sourceWord) {
        // // . assemble ALL translations for SOURCE WORD from different sources
        // let allTranslations = {};
        // let allTranslationsSet = [];
        // let unknownTranslationsSet = [];
        // $.each(sourceToTranslations, function(sourceId, wordToTranslations) {
        //     let sourceWordTranslations = wordToTranslations[sourceWord];
        //     if (sourceWordTranslations) {
        //         $.each(sourceWordTranslations, function(speachPart, words) {
        //             let wordsSet = new Set(words);
        //             let uniqueSet = new Set([x for (x of wordsSet) if (!allTranslationsSet.has(x))]);
        //             let wordsSet = new Set(words.concat([...allTranslationsSet]));

        //             if (wordsSet.length) {
        //                 if (speachPart == SpeachParts.UNKNOWN) {
        //                     // add to unknown
        //                     wordsSet = new Set([...wordsSet].concat(unknownTranslationsArr));
        //                     unknownTranslationsArr = unknownTranslationsArr.concat([...wordsSet]);
        //                 } else {
        //                     // remove from unknown
        //                     unknownTranslationsArr = unknownTranslationsArr.unique(words);
        //                     allTranslationsSet = new Set([...allTranslationsSet, ...wordsSet]);

        //                     let current = allTranslations[speachPart];                            
        //                     allTranslations[speachPart] = current ?
        //                         current.concat([...wordsSet]):
        //                         [...wordsSet];
        //                 }
        //             }
        //         });
        //     }
        // });
        // if (unknownTranslationsArr.length) {
        //     allTranslations[SpeachParts.UNKNOWN] = unknownTranslationsSet;
        // }
        // return JSON.stringify(allTranslations);

        function unique(a,b) {
            for(var i=0; i<a.length; ++i) {
                for(var j=0; j<b.length; ++j) {
                    if(a[i] === b[j])
                        a.splice(i, 1);
                }
            }
            return a;
        };

        // . assemble ALL translations for SOURCE WORD from different sources
        var allTranslations = {};
        var allTranslationsArr = [];
        var unknownTranslationsArr = [];
        $.each(sourceToTranslations, function(sourceId, wordToTranslations){
            var sourceWordTranslations = wordToTranslations[sourceWord];
            if(sourceWordTranslations){ 
                $.each(sourceWordTranslations, function(speachPart, words){
                    words = unique(words, allTranslationsArr);
                    if(words.length){
                        if(speachPart==SpeachParts.UNKNOWN){
                            // . add to unknown arr
                            words = unique(words, unknownTranslationsArr);
                            unknownTranslationsArr = unknownTranslationsArr.concat(words);
                        }
                        else {
                            // . remove from unknown arr
                            unknownTranslationsArr = unique(unknownTranslationsArr, words);
                            // . add to all arr
                            allTranslationsArr = allTranslationsArr.concat(words);
                            // . add to speach part arr
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
    }

    //***** PUBLIC ******************************************************************************************************

    addTranslation(inputData, translation, sourceId, bookId) {
        let self = this;
        let sourceToTranslations = this.getSourceToTranslations(inputData, translation, sourceId);
        let sourceWord = this.getSourceWord(sourceToTranslations[sourceId], translation);
        let translationData = {
            word: sourceWord,
            wordLanguage: inputData.sourceLang,
            wordPronunciation: this.getPronunciation(inputData),
            wordSoundUrls: this.getSoundUrls(inputData, translation),
            wordPictureUrls: this.getPictureUrls(inputData),
            bookId: bookId || 0,
            translationWord: translation,
            translationLanguage: inputData.targetLang,
            translationWords: this.getTranslations(sourceToTranslations, sourceWord),
            translationCards: this.getTranslationCards(inputData)
        };
        return this.provider.addTranslation(translationData).done(function(data) {
            self.addTranslationToBook(data.userBook, data.book, data.bookWord, data.translation);
        });
    }

    getBooks(language) {
        return this.provider.getBooks(language);
    }

    checkAuthentication(forceServerRequest) {
        let self = this;
        if (this.user && !forceServerRequest) {
            return this._getResolvedPromise({
                user: this.user
            });
        } else {
            return this.provider.checkAuthentication().done(function(data) {
                self.setUser(data.user, data.languages);
            }).fail(function() {
                self.setUser(null);
            });
        }
    }

    login(username, password) {
        let self = this;
        return this.provider.login(username, password).done(function(data) {
            self.setUser(data.user, data.languages);
        }).fail(function() {
            self.setUser(null);
        });
    }

    setUser(user, languages) {
        // if(this.user && user && this.user.id===user.id){
        //     return;
        // }
        this.user = this.aggregateUserData(user, languages);
        this.reactor.dispatchEvent(CVService.CHECK_AUTH_END);
    }

    updateLanguageBooks(language, books) {
        this.user.languagesData[language].books = books;

        this.aggregateTranslationsData(this.user.languagesData);
        this.user.hasUncompletedDE = this.hasAnyUncompletedDE(this.user.languagesData);
        this.reactor.dispatchEvent(CVService.USER_DATA_UPDATED);
    }

    addTranslationToBook(userBookDto, bookDto, bookWordDto, translationDto) {
        let book = this.findLanguageBook(bookDto.language, bookDto.id);
        if (!book) {
            book = this.addLanguageBook(userBookDto, bookDto);
        }
        if (!book.translations[bookWordDto.id]) {
            book.translations[bookWordDto.id] = [];
        }
        book.translations[bookWordDto.id].push(translationDto.id);

        this.aggregateTranslationsData(this.user.languagesData);
        this.user.hasUncompletedDE = this.hasAnyUncompletedDE(this.user.languagesData);
        this.reactor.dispatchEvent(CVService.USER_DATA_UPDATED);
    }

    findLanguageBook(language, id) {
        let books = this.user.languagesData[language].books;
        return books.filter(function(book) {
            return book.id == id;
        })[0];
    }

    addLanguageBook(userBookDto, bookDto) {
        let book = {
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
    }

    aggregateBooksByLanguage(books, languages) {
        let languagesData = {};
        for (let i = languages.length - 1; i >= 0; i--) {
            let language = languages[i];
            languagesData[language.id] = {
                languageName: language.name,
                books: []
            };
        };

        // . aggregate books by language
        books.forEach(function(book) {
            languagesData[book.language].books.push(book);
        });
        return languagesData;
    }

    parseBookJsonFields(languages) {
        function tryParseJson(value) {
            return value ?
                (typeof value === 'string' ? JSON.parse(value) : value) : {};
        };
        for (let language in languages) {
            let books = languages[language].books;
            books.forEach(function(book) {
                book.learnLevels = tryParseJson(book.learnLevels);
                book.learnDates = tryParseJson(book.learnDates);
                book.examDates = tryParseJson(book.examDates);
                book.promoteDates = tryParseJson(book.promoteDates);
            });
        }
    }

    aggregateTranslationsData(languages) {
        this.parseBookJsonFields(languages);

        // . calculate translations existance for each language
        for (let language in languages) {
            languages[language].hasTranslations = this.booksHasTranslations(languages[language].books);
            if (languages[language].hasTranslations) {
                languages[language].hasDE = this.deCalculator.hasDE(languages[language].books);
                languages[language].DENotCompleted = this.deCalculator.DENotCompleted(languages[language].books);
            }
        }
    }

    hasAnyUncompletedDE(languages) {
        for (let language in languages) {
            if (languages[language].hasTranslations && languages[language].hasDE && languages[language].DENotCompleted) {
                return true;
            }
        }
        return false;
    }

    aggregateUserData(user, languages) {
        if (!user) {
            return null;
        }
        let languagesData = this.aggregateBooksByLanguage(user.books, languages);

        this.aggregateTranslationsData(languagesData);
        user.languagesData = languagesData;
        user.hasUncompletedDE = this.hasAnyUncompletedDE(languagesData);
        delete user.books;
        return user;
    }

    booksHasTranslations(books) {
        for (let i = books.length - 1; i >= 0; i--) {
            if (Object.keys(books[i].translations).length) {
                return true;
            }
        };
        return false;
    }
}