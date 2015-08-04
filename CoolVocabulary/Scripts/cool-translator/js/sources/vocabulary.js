
function Vocabulary(config, connection){
    this.config = config;
    this.connection = connection;
};
Vocabulary.prototype.makeCall = function(method, params, callback){
  this.connection.makeRequest(this.config.id, method, params, callback);
};
Vocabulary.prototype.addTranslation = function(inputData,translation,callback){
    this.makeCall('addTranslation', [inputData,translation], callback);
};

Vocabulary.prototype.checkAuthentication = function(callback){
	this.makeCall('checkAuthentication', [], callback);
};

Vocabulary.prototype.login = function(username,password,callback){
	this.makeCall('login', [username, password], callback);
};