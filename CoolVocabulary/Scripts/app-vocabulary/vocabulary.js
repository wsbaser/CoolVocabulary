window.Vocabulary = Ember.Application.create({
	LOG_TRANSITIONS : true
});

Vocabulary.Router.map(function(){
  this.route('book', { path: 'book/:book_id' },function(){
    this.route('learn');
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
      payloadWithRoot[primaryType.modelName.pluralize()] = payload;
      return this._super(store, primaryType, payloadWithRoot, id, requestType);
    }
  },
  mapRecord: function(item) {
    var propertyName, value, newPropertyName;
    for (propertyName in item){
      value = item[propertyName];
      newPropertyName = propertyName.camelize();
      item[newPropertyName] = value;
      delete item[propertyName];
    }
  },
  serializeIntoHash: function(hash, type, record, options) {
    var jsonRecord, propertyName, value;
    jsonRecord = record.toJSON();
    for (propertyName in jsonRecord) {
      value = jsonRecord[propertyName];
      hash[propertyName.capitalize()] = value;
    }
  }
});
