function LLProvider(config) {
    DictionaryProvider.call(this, config);
};

LLProvider.prototype = Object.create(DictionaryProvider.prototype);

LLProvider.prototype._isTextTooLong = function(text){
    return text.replace(/ |\t|\r|\n/igm, '').length > this.config.maxTextLengthToTranslate;
};

LLProvider.prototype.getRequestName = function(contentType){
    this.checkIfContentTypeSupported(contentType);
    return 'loadTranslations';
};

LLProvider.prototype.loadTranslations = function (requestData) {
    var self = this;
    var deferred = $.Deferred();
    if(this._isTextTooLong(requestData.word))
        deferred.reject('Text too long.');
    else {
        var translateUrl = this.config.api + this.config.ajax.getTranslations;
        $.post(translateUrl,{
            word: requestData.word,
            include_media: 1,
            add_word_forms: 1,
            port: this.config.serverPort
        }).done(function(data){
            if(data.error_msg)
                deferred.reject(data.error_msg);
            else
                deferred.resolve($.extend(data,{
                    inputData: requestData,
                    inDictionary: null, //result.is_user, //todo: fix this later
                }));
        }).fail(function(jqXHR){
            self.rejectWithStatusCode(deferred, jqXHR);
        });
    }
    return deferred.promise();
};

//adds new translation when user clicks on translateion or enters custom translation
LLProvider.prototype.addTranslation = function (originalText, translatedText) {
    var self = this;
    var deferred = $.Deferred();
    $.post(this.config.api + this.config.ajax.addWordToDict,{
        word: originalText,
        tword: translatedText,
        context: '',
        context_url: '',
        context_title: ''
    }).done(function(data){
        if(data && data.error_msg){
            if (self._isNotAuthenticatedError(data))
                deferred.reject({notAuthenticated: true});
            else
                deferred.reject(data.error_msg);
        }
        else
            deferred.resolve(data);
    }).fail(function(jqXHR){
        self.rejectWithStatusCode(deferred, jqXHR);
    });

    return deferred.promise();
};

LLProvider.prototype._isNotAuthenticatedError=function(result) {
    return result && result.error_code === 401;
};

LLProvider.prototype.checkAuthentication = function () {
    var jqXHR = $.post(this.config.api + this.config.ajax.isAuthenticated);
    jqXHR.done(function(data){
        console.log(data);
    });
    return jqXHR;
};

LLProvider.prototype.login = function(username, pass) {
    var self = this;
    var deferred = $.Deferred();
    $.post(this.config.ajax.login, {
        email: username,
        password: pass
    }).done(function(data){
        if(data.error_msg)
            deferred.reject(data.error_msg);
        else
            deferred.resolve(data);
    }).fail(function(jqXHR){
        self.rejectWithStatusCode(deferred, jqXHR);
    });
    return deferred;
};