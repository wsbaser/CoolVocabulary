/**
 * Created by wsbaser on 16.03.2015.
 */
/* Wraps interaction with Translation Source server */

var AbbyServer = function(){
    /* Extract translations data from html response */
    this.loadTranslations = function(word, sourceLang,targetLang, callbackSuccess, callbackError) {
        var self = this;
        var translateUrl = abby.config.ajax.translate
            .replace('{sourceLang}', sourceLang)
            .replace('{targetLang}', targetLang)
            .replace('{word}', word);
        serverHelper.sendGetRequest(translateUrl, {
            isSilentError: true,
            onSuccess: callbackSuccess,
            onError: callbackError
        });
    };

    this.loadExamples = function(word, sourceLang,targetLang, callbackSuccess, callbackError) {
        var self = this;
        var translateUrl = abby.config.ajax.examples
            .replace('{sourceLang}', sourceLang)
            .replace('{targetLang}', targetLang)
            .replace('{word}', word);
        serverHelper.sendGetRequest(translateUrl, {
            isSilentError: true,
            onSuccess: callbackSuccess,
            onError: callbackError,
            processResponse: self.processResponse
        });
    };

    this.loadPhrases = function(word, sourceLang,targetLang, callbackSuccess, callbackError) {
        var self = this;
        var translateUrl = abby.config.ajax.phrases
            .replace('{sourceLang}', sourceLang)
            .replace('{targetLang}', targetLang)
            .replace('{word}', word);
        serverHelper.sendGetRequest(translateUrl, {
            isSilentError: true,
            onSuccess: callbackSuccess,
            onError: callbackError,
            processResponse: self.processResponse
        });
    };

};