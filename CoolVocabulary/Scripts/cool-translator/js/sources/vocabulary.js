function Vocabulary(config, connection, supportsBooks){
    this.config = config;
    this.connection = connection;
    this.supportsBooks = supportsBooks;
    this.user = {};
	this.reactor = new Reactor();
    this.reactor.registerEvent(Vocabulary.CHECK_AUTH_START);
    this.reactor.registerEvent(Vocabulary.CHECK_AUTH_END);
    this.bookId = 0;
    this._addOAuthLoginListener();
};

Vocabulary.CHECK_AUTH_START = 'authstart';
Vocabulary.CHECK_AUTH_END = 'authend';

Vocabulary.prototype.addEventListener = function(eventType, handler){
	this.reactor.addEventListener(eventType, handler)
};

Vocabulary.prototype.authenticate = function(user){
    this.user = user;
    this.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);
};

Vocabulary.prototype.checkAuthentication = function(){
	var self = this;
	this.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_START);
    this.makeCall('checkAuthentication', [], function(promise){
        promise.done(function(data){
            self.user = data.user;
        	self.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);
        }).fail(function(){
            self.user = null;
            self.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);            
        });
    });
};

Vocabulary.prototype.makeCall = function(method, params, callback){
  this.connection.makeRequest(this.config.id, method, params, callback);
};

Vocabulary.prototype.addTranslation = function(inputData, translation, serviceId, callback){
    var self = this;
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
};

Vocabulary.prototype.login = function(username, password, callback){
	var self = this;
    this.makeCall('login', [username, password], function(promise){
        promise.done(function(data){
            self.user = data.user;
            self.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);
        }).fail(function(){
            self.user = null;
            self.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);
        });
        callback(promise);
    }.bind(this));
};

Vocabulary.prototype.setBook = function(bookId, remember){
    this.bookId = bookId;
    this.bookRemembered = !!remember;
};

Vocabulary.prototype.oauthLoginDeferred = null;
Vocabulary.prototype.oauthLogin = function(){
    var oauthWindow = window.open(this.config.path.CTOAuth,'_blank');
    oauthWindow.addEventListener('close', function(){
        console.log('close oauth window');
    });
    this.oauthLoginDeferred = $.Deferred();
    return this.oauthLoginDeferred.promise();
};

Vocabulary.prototype._addOAuthLoginListener = function(){
    var self = this;
    window.addEventListener('message', function(event){
        if(event.data.type==='oauthsuccess'){
            self.user = event.data.user;
            self.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);
            if(self.oauthLoginDeferred){
                self.oauthLoginDeferred.resolve();
            }            
        }else if(event.data.type==='oautherror'){
            self.user = null;
            self.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);
            if(self.oauthLoginDeferred){
                self.oauthLoginDeferred.reject(event.data.error);
            }
        }
    });
};