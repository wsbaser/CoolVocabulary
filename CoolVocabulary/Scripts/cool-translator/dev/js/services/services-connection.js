'use strict';

import guid from 'guid';

export default class ServicesConnection{
  constructor(name){
    this.name = name;
    this.port = null;
    this.pendingRequests = {};
    this.pendingPromises = {};
  }

  open(){
    this.port = chrome.runtime.connect({
      name: this.name
    });
    this.port.onMessage.addListener(this.listener.bind(this));
  }

  listener(message){
    if(message.requestResult)
      this.resolveRequest(message.requestResult)
    else if(message.promiseResult)
      this.resolvePromise(message.promiseResult);
    else
      throw new Error('invalid message');
  }

  resolveRequest(result){
    let callback = this.pendingRequests[result.requestGuid];
    if(result.promiseGuid){
      let deferred = $.Deferred();
      this.pendingPromises[result.promiseGuid] = deferred;
      callback(deferred.promise());
    }
    else if(result.promiseGuids){
      let requestPromises = {};
      $.each(result.promiseGuids, function(type, promiseGuid){
        let deferred = $.Deferred();
        this.pendingPromises[promiseGuid] = deferred;
        requestPromises[type] = deferred.promise();    
      }.bind(this));
      callback(requestPromises);
    }
    else
      throw new Error('invalid request result');
    delete this.pendingRequests[result.requestGuid];
  }

  resolvePromise(result){
    let deferred = this.pendingPromises[result.promiseGuid];
    if(result.resolveData!=undefined)
      deferred.resolve(result.resolveData);
    else if(result.rejectData!=undefined)
      deferred.reject(result.rejectData);
    else
      throw new Error('invalid promise data');
    delete this.pendingPromises[result.promiseGuid];
  }

  saveRequest(guid, callback){
    this.pendingRequests[guid] = callback;
  }

  makeRequest(serviceId, method, params, callback){
    let requestGuid = guid();
    this.port.postMessage({
      serviceId: serviceId,
      method: method,
      params: params,
      requestGuid: requestGuid
    });
    this.saveRequest(requestGuid, callback);
  }
}