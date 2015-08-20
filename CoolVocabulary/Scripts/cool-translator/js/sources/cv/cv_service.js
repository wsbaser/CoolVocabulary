function CVService(provider){
    this.config = provider.config;
    this.provider = provider;
}

CVService.prototype.getBooks = function(language){
    var self = this;
    var deferred = $.Deferred();
    if(this.books)        
        deferred.resolve(this.books);
    else {
        this.provider.getBooks(language).done(function(books){
            self.books = books;
            deferred.resolve(books);
        }).fail(function(error){
            deferred.reject(error);
        });
    }
    return deferred.promise();
}

CVService.prototype.checkAuthentication = function(){
    var deferred = $.Deferred();
    if(localStorage.isCVAuthenticated==='true')
        deferred.resolve(true);
    else {
        this.provider.checkAuthentication().done(function(data){
            if(data.error_msg){
                localStorage.isLLAuthenticated = false;
                deferred.resolve(false);
                console.error(error_msg);
            }
            else{
                localStorage.isCVAuthenticated = data.is_authenticated;
                deferred.resolve(data.is_authenticated);
            }
        })
        .fail(function(error){
            localStorage.isLLAuthenticated = false;
            deferred.resolve(false);
            console.error(error.responseText);
        });
    }
    return deferred.promise();
};

CVService.prototype.login = function(username, password){
    var promise = this.provider.login(username,password);
    promise.done(function(){
        localStorage.isCVAuthenticated = true;
    });
    return promise;
}
