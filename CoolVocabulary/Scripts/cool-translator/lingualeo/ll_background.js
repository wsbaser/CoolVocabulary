/**
 * Created by wsbaser on 05.03.2015.
 */

lleo = {};
lleo.config = new LinguaLeoConfig();
lleo.isAuthenticated = null;

/***** Async  *********************************************************************************************************/
lleo._isTextTooLong = function(text){
    return text.replace(/ |\t|\r|\n/igm, '').length > lleo.config.maxTextLengthToTranslate;
};

lleo.getTranslations = function(data, callback) {
    if (lleo._isTextTooLong(data.word)) {
        callback({inputData: data, 'error': true, 'error_msg': 'Text too long.'});
    } else {
        lleo.server.loadTranslations(
            data.word,
            lleo.serverPort,
            function(result) {
                callback({
                    inputData: data,
                    inDictionary: null, //result.is_user, //todo: fix this later
                    translations: result.translate,
                    transcription: result.transcription,
                    picUrl: result.pic_url,
                    soundUrl: result.sound_url,
                    word_forms: result.word_forms
                });
            }, function(error_msg, result, status) {
                callback({inputData: data,'error': true, 'error_msg': error_msg, 'result': result, 'status': status});
            }
        );
    }
};

lleo.getIsAuthenticated = function(callback) {
    callback(lleo.isAuthenticated);
};

lleo.addTranslation = function(inputData, translation,callback) {
    lleo.server.addTranslation(inputData.word, translation, null, null, null,
        function() {
            callback();
        },
        function(error_msg, result, status) {
            var notAuthenticated = lleo._isNotAuthenticatedError(result);
            if (lleo._isNotAuthenticatedError(result)) {
                lleo.isAuthenticated = true;
                callback({notAuthenticated: true});
            }
            else
                callback({error_msg: error_msg});
        }
    );
};

/* Send request to server to check user authentication */
lleo.checkAuthentication = function (callback) {
    lleo.isAuthenticated = false;
    lleo.server.checkAuthentication(
        true,
        function (isAuthorized) {
            lleo.isAuthenticated = !!isAuthorized;
            if (callback)
                callback(isAuthorized);
        },
        function () {
            lleo.isAuthenticated = false;
            if (callback)
                callback(false);
        }
    );
};

lleo.loginUser = function (username, pass, callback) {
    lleo.server.login(username, pass, function (result) {
        if (!result.error_msg)
            lleo.isAuthenticated = true;
        callback(result);
    });
};

lleo._isNotAuthenticatedError=function(result) {
    return result && result.error_code === 401;
};

lleo.init = function() {
    lleo.server = new LingualeoServer(lleo.config.api);
    lleo.checkAuthentication();
    lleo.serverPort = kango.getExtensionInfo().settings['port'];
};

