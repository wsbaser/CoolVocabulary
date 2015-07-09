/**
 * Created by wsbaser on 05.03.2015.
 */
var abby = {};
abby.config = new AbbyConfig();

abby.init = function(){
    abby.server = new AbbyServer();
};

abby.getTranslations = function(data, callback) {
    abby.server.loadTranslations(data.word, data.sourceLang, data.targetLang,
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

abby.getExamples = function(data, callback) {
    abby.server.loadExamples(data.word, data.sourceLang, data.targetLang,
        function (response) {
            callback({inputData: data, response: response});
        },
        function (error_msg, response, status) {
            callback({inputData: data,'error': true, 'error_msg': error_msg, 'response': response, 'status': status});
        });
};

abby.getPhrases = function(data, callback) {
    abby.server.loadPhrases(data.word, data.sourceLang, data.targetLang,
        function (response) {
            callback({inputData: data, response: response});
        },
        function (error_msg, response, status) {
            callback({inputData: data, 'error': true, 'error_msg': error_msg, 'response': response, 'status': status});
        });
};