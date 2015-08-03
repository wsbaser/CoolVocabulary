function DictionaryServicesServer(services){
    this.services = services;
};

DictionaryServicesServer.CONNECTION_NAME = "dictionaryservices";

DictionaryServicesServer.prototype.listener = function(message, port){
    var self = this;
    var promises = this.callServiceMethod(message.serviceId, message.method, message.params);
    var promiseGuids = {};
    var result = {
        requestGuid: message.requestGuid,
        promiseGuids: promiseGuids
    };
    $.each(promises, function(type, promise){
        var promiseGuid = guid();
        promiseGuids[type] = promiseGuid;
        promise.done(function(data){
            self.resolvePromise(port, promiseGuid, data);
        })
        .fail(function(data){
            self.rejectPromise(port, promiseGuid, data);
        });
    });
    port.postMessage({
        requestResult: result
    });
};

DictionaryServicesServer.prototype.resolvePromise = function(port, guid, data){
    var result = {
        promiseResult: {
            promiseGuid: guid,
            resolveData: data
        }
    } 
    port.postMessage(result);
};

DictionaryServicesServer.prototype.rejectPromise = function(port, guid, data){
    var result = {
        promiseResult:{
            promiseGuid: guid,
            rejectData: data
        }
    }
    port.postMessage(result);
};

DictionaryServicesServer.prototype.callServiceMethod = function(serviceId, method, params){
    var service = this.services[serviceId];
    return service[method].apply(service, params);
};

DictionaryServicesServer.prototype.startListening = function(){
    chrome.runtime.onConnect.addListener(function(port){
        if(port.name != DictionaryServicesServer.CONNECTION_NAME)
            return;
        port.onMessage.addListener(this.listener.bind(this));
    }.bind(this));
};