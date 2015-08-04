/***** ServiceProxy **********************************************************************************************************/

function DictionaryServiceProxy(config, connection){
    this.config = config;
    this.connection = connection;
};
DictionaryServiceProxy.prototype.makeCall = function(method, params, callback){
  this.connection.makeRequest(this.config.id, method, params, callback);
};
DictionaryServiceProxy.prototype.getCards = function(requestData, callback){
    this.makeCall('getCards', [requestData], callback);
};

/***** SerivcesConnection *****************************************************************************************************/
function ServicesConnection(name){
  this.name = name;
  this.port = null;
  this.pendingRequests = {};
  this.pendingPromises = {};
};

ServicesConnection.prototype.open = function(){
  this.port = chrome.runtime.connect({
    name: this.name
  });
  this.port.onMessage.addListener(this.listener.bind(this));
};

ServicesConnection.prototype.listener = function(message){
  if(message.requestResult)
    this.resolveRequest(message.requestResult)
  else if(message.promiseResult)
    this.resolvePromise(message.promiseResult);
  else
    throw new Error('invalid message');
};

ServicesConnection.prototype.resolveRequest = function(result){
  var callback = this.pendingRequests[result.requestGuid];
  if(result.promiseGuid){
    var deferred = $.Deferred();
    this.pendingPromises[result.promiseGuid] = deferred;
    callback(deferred.promise());
  }
  else if(result.promiseGuids){
    var requestPromises = {};
    $.each(result.promiseGuids, function(type, promiseGuid){
      var deferred = $.Deferred();
      this.pendingPromises[promiseGuid] = deferred;
      requestPromises[type] = deferred.promise();    
    }.bind(this));
    callback(requestPromises);
  }
  else
    throw new Error('invalid request result');
  delete this.pendingRequests[result.requestGuid];
};

ServicesConnection.prototype.resolvePromise = function(result){
  var deferred = this.pendingPromises[result.promiseGuid];
  if(result.resolveData!=undefined)
    deferred.resolve(result.resolveData);
  else if(result.rejectData!=undefined)
    deferred.reject(result.rejectData);
  else
    throw new Error('invalid promise data');
  delete this.pendingPromises[result.promiseGuid];
};

ServicesConnection.prototype.saveRequest = function(guid, callback){
  this.pendingRequests[guid] = callback;
};

ServicesConnection.prototype.makeRequest = function(serviceId, method, params, callback){
  var requestGuid = guid();
  this.port.postMessage({
    serviceId: serviceId,
    method: method,
    params: params,
    requestGuid: requestGuid
  });
  this.saveRequest(requestGuid, callback);
};