/**
 * Created by wsbaser on 13.03.2015.
 */
var serverHelper = (function(){
    var serverHelper = {};

    function sendRequest(method, url, options) {
        var details = {
            'method': method,
            'url': url,
            'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
            'params': options.params
        };

        kango.xhr.send(details, function (data) {
            // . Analyze response
            var response;
            if (data.status !== 200)
                response = {error_msg: 'Server error (' + data.status + ')'};
            else {
                if (options.isJsonResult) {
                    try {
                        response = JSON.parse(data.response);
                    } catch (e) {
                        response = {error_msg: 'Wrong server response.'}
                    }
                }
                else
                    response = data.response || {error_msg: 'Server did not respond.'};
            }
            // . send result with callback
            if (response && response.error_msg) {
                if (options.onError)
                    options.onError(response.error_msg, response, data.status);
            }
            else {
                if (options.onSuccess)
                    options.onSuccess(response,data.status);
            }
            if (options.onComplete)
                options.onComplete(response);
        });
    }

    serverHelper.sendPostRequest = function(url, options) {
        sendRequest('POST', url, options);
    };

    serverHelper.sendGetRequest = function(url, options) {
        sendRequest('GET', url, options);
    };

    return serverHelper;
})();