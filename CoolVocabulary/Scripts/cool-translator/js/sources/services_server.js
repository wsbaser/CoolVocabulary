function DictionaryServicesServer(services){
    this.services = services;
};

DictionaryServicesServer.CONNECTION_NAME = "services_connection";

DictionaryServicesServer.prototype.listener = function(message, port){
    var self = this;
    var methodResult = this.callServiceMethod(message.serviceId, message.method, message.params);
    var requestResult = {
        requestGuid: message.requestGuid
    };
    var promises = {};
    if(methodResult.done && methodResult.fail){
        // it is a single promise
        requestResult.promiseGuid = guid();
        promises[requestResult.promiseGuid] = methodResult;
    }
    else{
        // it is a dictionary of promises
        var promiseGuids = {};
        requestResult.promiseGuids = promiseGuids;
        $.each(methodResult, function(type, promise){
            promiseGuids[type] = guid();
            promises[promiseGuids[type]] = promise;
        });
    }
    port.postMessage({
        requestResult: requestResult
    });
    // . bind promise events after sending promises to client
    //   if not, promises coud be resolved before client got their guids
    $.each(promises, function(guid, promise){
        self._bindPromiseEvents(promise,port,guid);
    });
};

DictionaryServicesServer.prototype._bindPromiseEvents = function(promise,port,guid){
    var self = this;
    promise.done(function(data){
        self.resolvePromise(port, guid, data);
    })
    .fail(function(data){
        self.rejectPromise(port, guid, data);
    });
}

DictionaryServicesServer.prototype.resolvePromise = function(port, guid, data){
    var result = {
        promiseResult: {
            promiseGuid: guid,
            resolveData: data || {}
        }
    }
    port.postMessage(result);
};

DictionaryServicesServer.prototype.rejectPromise = function(port, guid, data){
    var result = {
        promiseResult:{
            promiseGuid: guid,
            rejectData: data || {}
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