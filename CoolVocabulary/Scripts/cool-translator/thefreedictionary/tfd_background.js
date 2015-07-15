/**
 * Created by wsbaser on 25.04.2015.
 */
var tfd = {};
tfd.config = TfdConfig();

tfd.init = function(){
    tfd.server = new TfdServer();
};

tfd.getTranslations = function(data, callback) {
    tfd.server.loadTranslationsArticle(data.word, data.sourceLang, data.targetLang,
        function (response) {
            callback({inputData: data, response: response});
        },
        function (error_msg, response, status) {
            callback({inputData: data,'error': true, 'error_msg': error_msg, 'response': response, 'status': status});
        });
};