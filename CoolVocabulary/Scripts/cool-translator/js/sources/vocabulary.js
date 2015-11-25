function Vocabulary(config, connection, supportsBooks){
    this.config = config;
    this.connection = connection;
    this.supportsBooks = supportsBooks;
    this.user = {};
	this.reactor = new Reactor();
    this.reactor.registerEvent(Vocabulary.CHECK_AUTH_START);
    this.reactor.registerEvent(Vocabulary.CHECK_AUTH_END);
    this.bookId = 0; 
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

Vocabulary.prototype.addTranslation = function(inputData,translation,callback){
    this.makeCall('addTranslation', [inputData, translation, this.bookId], callback);
};

Vocabulary.prototype.login = function(username, password, callback){
	this.makeCall('login', [username, password], function(promise){
        callback(promise);
        promise.done(function(data){
            self.user = data.user;
        }).fail(function(){
            self.user = null;
        });
    }.bind(this));
};

Vocabulary.prototype.setBook = function(bookId){
    this.bookId = bookId;
};

Vocabulary.prototype.oauthLogin = function(){
    var self = this;
    var oauthWindow = window.open('http://localhost:13189/CTOAuth','_blank');
    var deferred = $.Deferred();
    oauthWindow.addEventListener('close', function(){
        console.log('close oauth window');
    });
    oauthWindow.addEventListener('message', function(event){
        if(event.data.type==='oauthSuccess'){
            self.user = {
                id: event.data.id,
                name: event.data.name,
                books: event.data.books
            };
            deferred.resolve();            
        }else if(event.data.type==='oauthError'){
            self.user = null;
            deferred.reject(event.data.error);
        }
    });
    return deferred.promise();
}