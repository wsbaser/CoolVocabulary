window.Vocabulary = Ember.Application.create({
	LOG_TRANSITIONS : true
});

Vocabulary.Router.map(function(){
  this.route('book', { path: 'book/:book_id' }, function(){
    this.route('index', {path:'/'}, function(){
      this.route('wordTranslation', { path:'word/:bookWord_id', resetNamespace: true });
    });
    this.route('learn', {path:'/learn/:word_id'});
    this.route('exam');
    this.route('edit');
  });
  this.route('createBook');
});

Vocabulary.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api',
  pathForType: function(type) {
    return type.camelize().capitalize();
  }
});

Vocabulary.ApplicationSerializer = DS.RESTSerializer.extend({
  normalizeResponse: function(store, primaryType, payload, id, requestType) {
    if(payload.emberDataFormat){
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