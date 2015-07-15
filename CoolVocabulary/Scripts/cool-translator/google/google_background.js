/**
 * Created by wsbaser on 25.03.2015.
 */

var google = {};
google.config = GoogleConfig();

google.init = function(){
    google.server = new GoogleServer();
};


google.getTranslations = function(data, callback) {
    google.server.loadTranslationsArticle(data.word, data.sourceLang, data.targetLang,
        function (response) {
            callback({inputData: data, response: response});
        },
        function (error_msg, response, status) {
            callback({
                inputData: data,
                'error': true,
                'error_msg': error_msg,
                'response': response,
                'status': status
            });
        });
};