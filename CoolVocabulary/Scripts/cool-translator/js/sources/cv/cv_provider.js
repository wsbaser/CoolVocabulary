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
    $.post(this.config.ajax.checkAuthentication).done(function(data){
        if(data.error_msg)
            deferred.reject(data.error_msg);
        else
            deferred.resolve(data);
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

CVProvider.prototype.addTranslation = function(data){
    var self = this;
    var deferred = $.Deferred();
    $.ajax(this.config.ajax.addTranslation, {
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function(error) {
            deferred.reject(error.responseText);
        },
        success: function(data, status, xhr) {
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