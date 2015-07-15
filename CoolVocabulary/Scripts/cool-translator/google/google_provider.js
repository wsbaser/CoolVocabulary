/**
 * Created by wsbaser on 25.03.2015.
 */
var GoogleServer = function(){

    function convertGoogleResponseToValidJson(googleResponse){
        return googleResponse.replace(/\[,/g,'[null,').replace(/,,+/g,',null,').replace(/,\]/g,',null]')
    };
    /* Extract translations data from html response */
    this.processResponse = function(response) {
        var arrayString = convertGoogleResponseToValidJson(response);
        arrayString = arrayString.replace(new RegExp('\'', 'g'), '&apos;');
        try {
            var arr = JSON.parse(arrayString);
        }
        catch(e) {
            console.error('GoogleServer.processResponse: unable to parse json. ' + arrayString);
            return {error_msg: "Invalid server result"};
        }
        var jsonObject = {};
        try {
            jsonObject.pos = arr[1][0][0];
            jsonObject.word = arr[1][0][3];
        }
        catch (e){
            return null;
        }
        try {
            jsonObject.entry = $(arr[1][0][2]).map(function (entry) {
                return {
                    word: entry[0],
                    reverse_translation: entry[1],
                    score: entry[3] || 0
                }
            }).toArray();
        }
        catch (e) {
            jsonObject.entry = [];
        }
        try {
            jsonObject.definitions = $(arr[10][0][1]).map(function (item) {
                return {
                    definition: item[0],
                    example: item[2]
                };
            }).toArray();
        }
        catch (e) {
            jsonObject.definitions = [];
        }
        try {
            jsonObject.examples = $(arr[11][0]).map(function (item) {
                return item[0];
            }).toArray();
        }
        catch (e) {
            jsonObject.examples = [];
        }
        return jsonObject;
    };
    this.loadTranslationsArticle = function(word, sourceLang,targetLang, callbackSuccess, callbackError) {
        var self = this;
        var translateUrl = google.config.ajax.translate
            .replace('{sourceLang}', sourceLang)
            .replace('{targetLang}', targetLang)
            .replace('{word}', word);
        serverHelper.sendGetRequest(translateUrl, {
            isSilentError: true,
            onSuccess: function (response, status) {
                response = this.processResponse(response);
                if (response && response.error_msg)
                    callbackError(response.error_msg, response, status)
                else
                    callbackSuccess(response);
            }.bind(this),
            onError: callbackError
        });
    };
};