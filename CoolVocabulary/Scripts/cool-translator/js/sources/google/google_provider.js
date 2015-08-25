/**
 * Created by wsbaser on 25.03.2015.
 */
function GoogleProvider(config){
    DictionaryProvider.call(this,config);
}

GoogleProvider.prototype = Object.create(DictionaryProvider.prototype);

GoogleProvider.prototype.convertGoogleResponseToValidJson = function(googleResponse){
    return googleResponse.replace(/\[,/g,'[null,').replace(/,,+/g,',null,').replace(/,\]/g,',null]')
};

GoogleProvider.prototype.processResponse = function(response) {
    var arrayString = this.convertGoogleResponseToValidJson(response);
    arrayString = arrayString.replace(new RegExp('\'', 'g'), '&apos;');
    console.log(arrayString);
    try {
        var arr = JSON.parse(arrayString);
    }
    catch(e) {
        console.error('GoogleServer.processResponse: unable to parse json. ' + arrayString);
        throw new Error('Error. Invalid server response.');
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
        jsonObject.entry = $.map(arr[1][0][2], function (entry) {
            return {
                word: entry[0],
                reverse_translation: entry[1],
                score: entry[3] || 0
            }
        });
    }
    catch (e) {
        jsonObject.entry = [];
    }
    try {
        jsonObject.definitions = $.map(arr[10][0][1], function (item) {
            return {
                definition: item[0],
                example: item[2]
            };
        });
    }
    catch (e) {
        jsonObject.definitions = [];
    }
    try {
        jsonObject.examples = $.map(arr[11][0], function (item) {
            return item[0];
        });
    }
    catch (e) {
        jsonObject.examples = [];
    }
    return jsonObject;
};

GoogleProvider.prototype.makeRequest = function(urlTemplate, requestData) {
};

GoogleProvider.prototype.requestTranslationsData = function(requestData) {
    var self = this;
    var deferred = $.Deferred();
    var translateUrl = this.formatRequestUrl(this.config.ajax.translate, requestData);
    console.log(translateUrl);
    $.ajax(translateUrl,{dataType:'text'}).done(function (data) {
        try{
            deferred.resolve(self.processResponse(data));
        }
        catch(e){
            deferred.reject(e.message);
        }
    }).fail(function (jqXHR) {
        self.rejectWithStatusCode(deferred, jqXHR);
    });
    return deferred.promise();
};