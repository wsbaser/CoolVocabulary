/**
 * Created by wsbaser on 25.04.2015.
 */
/**
 * Created by wsbaser on 25.03.2015.
 */
var TfdServer = function(){
    this.loadTranslationsArticle = function(word, sourceLang,targetLang, callbackSuccess, callbackError) {
        var self = this;
        var translateUrl = tfd.config.ajax.translate
            .replace('{word}', word);
        serverHelper.sendGetRequest(translateUrl, {
            isSilentError: true,
            onSuccess: callbackSuccess,
            onError: callbackError
        });
    };
};