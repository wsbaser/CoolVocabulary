/**
 * Created by wsbaser on 25.03.2015.
 */
function GoogleProvider(){

}

GoogleProvider.prototype.convertGoogleResponseToValidJson = function(googleResponse){
    return googleResponse.replace(/\[,/g,'[null,').replace(/,,+/g,',null,').replace(/,\]/g,',null]')
};

GoogleProvider.prototype.processResponse = function(response) {
    var arrayString = this.convertGoogleResponseToValidJson(response);
    arrayString = arrayString.replace(new RegExp('\'', 'g'), '&apos;');
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

GoogleProvider.prototype.getRequestName = function(contentType){
    this.checkIfContentTypeSupported(contentType);
    return 'loadWordArticle';
};

GoogleProvider.prototype.makeRequest = function(urlTemplate, requestData) {
};

GoogleProvider.prototype.loadWordArticle = function(requestData) {
    var deferred = $.Deferred();
    var translateUrl = this.formatRequestUrl(urlTemplate, requestData);
    $.get(translateUrl).when(function (data) {
        try{
            deferred.resolve(this.processResponse(data));
        }
        catch(e){
            deferred.reject(e.message);
        }
    }, function (jqXHR) {
        this.rejectWithStatusCode(deferred, jqXHR);
    });
    return deferred.promise();
};