function CVProvider(config){
	this.config = config;
}

CVProvider.prototype.getBooks = function(){
	var deferred = $.Deferred();
	$.post(this.config.ajax.getBooks).done(function(data){
        if(data.error_msg)
            deferred.reject(data.error_msg);
        else{
            deferred.resolve(data.vocabularies);
        }
    })
    .fail(function(error){
        deferred.reject(error);
    });
    return deferred.promise();
}

CVProvider.prototype.checkAuthentication = function () {
    return $.post(this.config.ajax.isAuthenticated);
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
        self.rejectWithStatusCode(deferred, jqXHR);
    });
    return deferred;
};