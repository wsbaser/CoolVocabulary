function Vocabulary(config, connection, supportsBooks){
    this.config = config;
    this.connection = connection;
    this.supportsBooks = supportsBooks;
    this.user = {};
	this.reactor = new Reactor();
    this.reactor.registerEvent(Vocabulary.CHECK_AUTH_START);
    this.reactor.registerEvent(Vocabulary.CHECK_AUTH_END);  
};

Vocabulary.CHECK_AUTH_START = 'authstart';
Vocabulary.CHECK_AUTH_END = 'authend';

Vocabulary.prototype.addEventListener = function(eventType, handler){
	this.reactor.addEventListener(eventType, handler)
};

Vocabulary.prototype.checkAuthentication = function(){
	var self = this;
	this.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_START);
    this.makeCall('checkAuthentication', [], function(promise){
        promise.done(function(data){
        	self.user = data.user;
        	self.reactor.dispatchEvent(Vocabulary.CHECK_AUTH_END);
        });
    });
};

Vocabulary.prototype.makeCall = function(method, params, callback){
  this.connection.makeRequest(this.config.id, method, params, callback);
};

Vocabulary.prototype.addTranslation = function(inputData,translation,callback){
    this.makeCall('addTranslation', [inputData,translation], callback);
};

Vocabulary.prototype.login = function(username,password,callback){
	this.makeCall('login', [username, password], callback);
};

Vocabulary.prototype.getBooks = function(callback){
	this.makeCall('getBooks', [], callback);
};