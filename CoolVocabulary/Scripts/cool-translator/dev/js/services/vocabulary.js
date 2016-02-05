'use strict';

import Reactor from 'reactor';

export default class Vocabulary{
    constructor(config, connection, supportsBooks){
        this.config = config;
        this.connection = connection;
        this.supportsBooks = supportsBooks;
        this.user = {};
        this.reactor = new Reactor();
        this.reactor.registerEvent(Vocabulary.CHECK_AUTH_START);
        this.reactor.registerEvent(Vocabulary.CHECK_AUTH_END);
        this.bookId = 0;
        this.oauthLoginDeferred = null;
    }

    static get CHECK_AUTH_START(){
        return 'authstart';
    }

    static get CHECK_AUTH_END(){
        return 'authend';
    }

    addEventListener(eventType, handler){
    	this.reactor.addEventListener(eventType, handler);
    }

    authenticate(user){
        this.user = user;
        this.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);
        if(this.oauthLoginDeferred){
            if(this.user){
                this.oauthLoginDeferred.resolve();
            }
            else{
                this.oauthLoginDeferred.reject();
            }
            this.oauthLoginDeferred = null;
        }
    }

    checkAuthentication(){
    	let self = this;
    	this.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_START);
        this.makeCall('checkAuthentication', [], function(promise){
            promise.done(function(data){
                self.authenticate(data.user);
            }).fail(function(){
                self.authenticate(null);
            });
        });
    }

    makeCall(method, params, callback){
      this.connection.makeRequest(this.config.id, method, params, callback);
    }

    addTranslation(inputData, translation, serviceId, callback){
        let self = this;
        this.makeCall('addTranslation', [inputData, translation, serviceId, this.bookId], function(promise){
            promise.done(function(response){
                response = response || {};
                // . generate addtranslation event
                if(window.location.origin=== self.config.siteOrigin){
                    window.postMessage({
                        type: 'addTranslation',
                        book: response.book,
                        word: response.word,
                        userBook: response.userBook,
                        bookWord: response.bookWord,
                        translation: response.translation }, self.config.siteOrigin);
                }
            });
            callback(promise);
        });
    }

    login(username, password, callback){
    	let self = this;
        this.makeCall('login', [username, password], function(promise){
            promise.done(function(data){
                self.authenticate(data.user);
            }).fail(function(){
                self.authenticate(null);
            });
            callback(promise);
        }.bind(this));
    }

    setBook(bookId, remember){
        this.bookId = bookId;
        this.bookRemembered = !!remember;
    }

    oauthLogin(){
        let oauthWindow = window.open(this.config.path.CTOAuth,'_blank');
        this.oauthLoginDeferred = $.Deferred();
        return this.oauthLoginDeferred.promise();
    }
}