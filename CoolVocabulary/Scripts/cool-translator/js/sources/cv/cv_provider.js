function CVProvider(config){
	this.config = config;
}

CVProvider.prototype._rejectUnauthorized = function(deferred, xhr){
    var response = JSON.parse(xhr.getResponseHeader("X-Responded-JSON"));
    if(response && response.status==401){
        deferred.reject({
            notAuthenticated: true
        });
        return true;
    }
    return false;
};

CVProvider.prototype.getBooks = function(){
    var self = this;
	var deferred = $.Deferred();
	$.post(this.config.ajax.getBooks).done(function(data,status,xhr){
        if(self._rejectUnauthorized(deferred,xhr))
            return;
        if(data.error_msg)
            deferred.reject(data.error_msg);
        else 
            deferred.resolve(data.vocabularies);
    })
    .fail(function(error){
        deferred.reject(error);
    });
    return deferred.promise();
};

CVProvider.prototype.checkAuthentication = function () {
    var self = this;
    var deferred = $.Deferred();
    $.post(this.config.ajax.isAuthenticated).done(function(data){
        if(data.error_msg)
            deferred.reject(data.error_msg);
        else
            deferred.resolve(data.is_authenticated);
    }).fail(function(jqXHR){
        deferred.reject('Error. Status(' + jqXHR.status+')');
    });
    return deferred.promise();
};

CVProvider.prototype.login = function(username, pass) {
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
        deferred.reject('Error. Status(' + jqXHR.status+')');
    });
    return deferred.promise();
};

CVProvider.prototype.addWord = function(word, wordTranslation){
    var self = this;
    var deferred = $.Deferred();
    $.ajax(this.config.ajax.addWord,{
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            word: word,
            wordTranslation: wordTranslation
        }),
        error: function(error) {
            deferred.reject(error);
        },
        success: function(data,status,xhr) {
            if(self._rejectUnauthorized(deferred, xhr))
                return;
            if(data.error_msg)
                deferred.reject(data.error_msg);
            else
                deferred.resolve(data);
        }
    });
    return deferred.promise();
};

CVProvider.prototype.addWordTranslations = function(sourceLang, targetLang, wordTranslations){
    var self = this;
    var deferred = $.Deferred();
    $.ajax(this.config.ajax.addWordTranslations,{
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify({
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            wordTranslations: wordTranslations
        }),
        error: function(error) {
            deferred.reject(error);
        },
        success: function(data,status,xhr) {
            if(self._rejectUnauthorized(deferred, xhr))
                return;
            if(data.error_msg)
                deferred.reject(data.error_msg);
            else
                deferred.resolve(data);
        }
    });
    return deferred.promise();
};