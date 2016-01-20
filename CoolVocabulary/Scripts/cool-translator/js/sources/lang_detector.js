function LangDetector(config, connection){
    this.config = config;
    this.connection = connection;
};

LangDetector.prototype.detect = function(word,callback){
    this.connection.makeRequest(this.config.id, 'detectLanguage', [word], callback);
};