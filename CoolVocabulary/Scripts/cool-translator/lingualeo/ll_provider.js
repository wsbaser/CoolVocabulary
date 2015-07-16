function LingualeoProvider(config) {
    SourceProvider.call(this, config);
};

LingualeoProvider.prototype = Object.create(SourceProvider.prototype);

LingualeoProvider.prototype._isTextTooLong = function(text){
    return text.replace(/ |\t|\r|\n/igm, '').length > this.config.maxTextLengthToTranslate;
};

LingualeoProvider.prototype.getRequestName = function(contentType){
    this.checkIfContentTypeSupported(contentType);
    return 'loadTranslations';
};

LingualeoProvider.prototype.loadTranslations = function (requestData) {
    var deferred = $.Deferred();
    if(this._isTextTooLong(requestData.word))
        deferred.reject('Text too long.');
    else {
        var translateUrl = this.config.api + this.config.ajax.getTranslations;
        $.post(translateUrl,{
            word: requestData.word,
            include_media: 1,
            add_word_forms: 1,
            port: config.serverPort
        }).done(function(data){
            if(data.error_msg)
                deferred.reject(data.error_msg);
            else
                deferred.resolve($.extend(data,{
                    inputData: requestData,
                    inDictionary: null, //result.is_user, //todo: fix this later
                }));
        }).fail(function(jqXHR){
            this.rejectWithStatusCode(deferred, jqXHR);
        });
    }
    return deferred.promise();
};

//adds new translation when user clicks on translateion or enters custom translation
LingualeoProvider.prototype.addTranslation = function (originalText, translatedText) {
    var deferred = $.Deferred();
    $.post(this.config.api + this.config.ajax.addWordToDict,{
        word: originalText,
        tword: translatedText,
        context: context || '',
        context_url: pageUrl || '',
        context_title: pageTitle || ''
    }).done(function(data){
        if(data && data.error_msg){
            if (this._isNotAuthenticatedError(data))
                deferred.resolve({notAuthenticated: true});
            else
                deferred.reject(data.error_msg);
        }
        else
            deferred.resolve(data);
    }).fail(function(jqXHR){
        this.rejectWithStatusCode(deferred,jqXHR);
    });

    return deferred.promise();
};

LingualeoProvider.prototype._isNotAuthenticatedError=function(result) {
    return result && result.error_code === 401;
};

LingualeoProvider.prototype.checkAuthentication = function (isSilentError, callbackSuccess, callbackError) {
    return $.post.sendPostRequest(this.config.api + this.config.ajax.isAuthenticated);
};

LingualeoProvider.prototype.login = function(username, pass) {
    return $.post(this.config.ajax.login, {
            email: username,
            password: pass
        }
    });
};