var LingualeoServer = function(baseURL) {

    this.loadTranslationsArticle = function (originalText, port, callbackSuccess, callbackError) {
        var self = this;
        var translateUrl = baseURL + lleo.config.ajax.getTranslations;
        serverHelper.sendPostRequest(translateUrl, {
            isSilentError: true,
            params: {
                word: originalText,
                include_media: 1,
                add_word_forms: 1,
                port: port
            },
            isJsonResult: true,
            onSuccess: callbackSuccess,
            onError: callbackError
        });
    };

    //adds new translation when user clicks on translateion or enters custom translation
    this.addTranslation = function (originalText, translatedText, context, pageUrl, pageTitle, callbackSuccess, callbackError) {
        serverHelper.sendPostRequest(baseURL + lleo.config.ajax.addWordToDict, {
            isSilentError: false,
            params: {
                word: originalText,
                tword: translatedText,
                context: context || '',
                context_url: pageUrl,
                context_title: pageTitle
            },
            isJsonResult: true,
            onSuccess: callbackSuccess,
            onError: callbackError
        });
    };

    this.checkAuthentication = function (isSilentError, callbackSuccess, callbackError) {
        serverHelper.sendPostRequest(baseURL + lleo.config.ajax.isAuthenticated, {
            isSilentError: isSilentError,
            onSuccess: function (result) {
                if (callbackSuccess) {
                    callbackSuccess(result.is_authorized);
                }
            },
            isJsonResult: true,
            onError: callbackError
        });
    };


    this.login = function (username, pass, callback) {
        serverHelper.sendPostRequest(lleo.config.ajax.login, {
            isSilentError: true,
            isJsonResult: true,
            params: {
                email: encodeURIComponent(username),
                password: encodeURIComponent(pass)
            },
            onComplete: callback
        });
    };
};
