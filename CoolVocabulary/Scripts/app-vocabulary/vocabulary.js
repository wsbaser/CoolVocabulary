window.DEBUG = true;
window.Vocabulary = Ember.Application.create({
	LOG_TRANSITIONS : true
});

Vocabulary.Router.map(function(){
  this.route('language', {path:'/:language_id'}, function(){
    this.route('book', { path: 'book/:userBook_id', resetNamespace: true }, function(){
      this.route('index', {path:'/'}, function(){
        this.route('wordTranslation', { path:'word/:bookWord_id', resetNamespace: true });
      });
      this.route('learn', {path:'/learn/:word_id'});
      this.route('exam');
      this.route('edit');
    });
    this.route('createBook', { resetNamespace: true });
  });
});

Vocabulary.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api',
  pathForType: function(type) {
    return type.camelize().capitalize();
  }
});

Vocabulary.ApplicationSerializer = DS.RESTSerializer.extend({
  normalizeResponse: function(store, primaryType, payload, id, requestType) {
    if(payload.emberDataFormat || payload.errors){
      return this._super(store, primaryType, payload, id, requestType);
    }
    else {
      var i, record, payloadWithRoot;
      // if the payload has a length property, then we know it's an array
      if (payload.length) {
        for (i = 0; i < payload.length; i++) {
          record = payload[i];
          this.mapRecord(record);
        }
      } else {
        // payload is a single object instead of an array
        this.mapRecord(payload);
      }
      payloadWithRoot = {};
      payloadWithRoot[primaryType.modelName.camelize().pluralize()] = payload;
      return this._super(store, primaryType, payloadWithRoot, id, requestType);
    }
  },
  mapRecord: function(item) {
    var propertyName, value, newPropertyName;
    for (propertyName in item){
      value = item[propertyName];
      newPropertyName = propertyName.camelize();
      if(newPropertyName!==propertyName){
        item[newPropertyName] = value;
        delete item[propertyName];
      }
    }
  },
  serializeIntoHash: function(hash, type, record, options) {
    var jsonRecord, propertyName, value;
    jsonRecord = record.record.toJSON();
    for (propertyName in jsonRecord) {
      value = jsonRecord[propertyName];
      hash[propertyName] = value;
    }
  }
});

Array.prototype.shuffle = function(){
  var o = this;
  for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x){}
  return this;
};

/**********************************************************************************************************************/
// taken from http://stackoverflow.com/questions/15308371/custom-events-model-without-using-dom-events-in-javascript

function Event(name){
  this.name = name;
  this.callbacks = [];
}
Event.prototype.registerCallback = function(callback){
  this.callbacks.push(callback);
};

function Reactor(){
  this.events = {};
}

Reactor.prototype.registerEvent = function(eventName){
  var event = new Event(eventName);
  this.events[eventName] = event;
};

Reactor.prototype.dispatchEvent = function(eventName, eventArgs){
  this.events[eventName].callbacks.forEach(function(callback){
    callback(eventArgs);
  });
};

Reactor.prototype.addEventListener = function(eventName, callback){
  this.events[eventName].registerCallback(callback);
};