'use strict';

import guid from 'guid';

const CONNECTION_NAME = "services_connection";

export default class ServicesServer{
    constructor(services){
        this.services = services;
    }

    listener(message, port){
        let self = this;
        let methodResult = this.callServiceMethod(message.serviceId, message.method, message.params);
        let requestResult = {
            requestGuid: message.requestGuid
        };
        let promises = {};
        if(methodResult.done && methodResult.fail){
            // it is a single promise
            requestResult.promiseGuid = guid();
            promises[requestResult.promiseGuid] = methodResult;
        }
        else{
            // it is a dictionary of promises
            let promiseGuids = {};
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
    }

    _bindPromiseEvents(promise,port,guid){
        let self = this;
        promise.done(function(data){
            self.resolvePromise(port, guid, data);
        })
        .fail(function(data){
            self.rejectPromise(port, guid, data);
        });
    }

    resolvePromise(port, guid, data){
        let result = {
            promiseResult: {
                promiseGuid: guid,
                resolveData: data==null?{}:data
            }
        }
        port.postMessage(result);
    }

    rejectPromise(port, guid, data){
        let result = {
            promiseResult:{
                promiseGuid: guid,
                rejectData: data==null?{}:data
            }
        }
        port.postMessage(result);
    }

    callServiceMethod(serviceId, method, params){
        let service = this.services[serviceId];
        return service[method].apply(service, params);
    }

    listen(){
        chrome.runtime.onConnect.addListener(function(port){
            if(port.name != CONNECTION_NAME)
                return;
            port.onMessage.addListener(this.listener.bind(this));
        }.bind(this));
    }

    static create(servicesArr){
        var services = {};
        servicesArr.forEach(function(service){
            services[service.config.id] = service;
        });
        return new ServicesServer(services);
    }
}