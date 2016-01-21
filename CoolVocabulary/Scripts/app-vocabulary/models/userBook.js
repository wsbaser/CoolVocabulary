Vocabulary.UserBook = DS.Model.extend({
  book: DS.belongsTo("book"),
  user: DS.belongsTo("user"),
	learnLevels: DS.attr(),
	learnDates: DS.attr(),
	examDates: DS.attr(),
	promoteDates: DS.attr(),
  translations: DS.attr(),
	inProgressCount: Ember.computed('learnLevels', function(){
		var learnLevels = this.get('learnLevels');
		var count=0;
		for(var translationId in learnLevels){
			var learnLevel = learnLevels[translationId];
			if(learnLevel>0&&learnLevel<MAX_LEARN_LEVEL){
				count++;
			}
		}
		return count;
	})
});

Vocabulary.UserBookSerializer = DS.RESTSerializer.extend({
  serialize: function(snapshot, options) {
    var json = this._super.apply(this, arguments);
    json.learnLevels = JSON.stringify(json.learnLevels);
    json.learnDates = JSON.stringify(json.learnDates);
    json.examDates = JSON.stringify(json.examDates);
    json.promoteDates = JSON.stringify(json.promoteDates);
    //json.translations = json.translations;
    return json;
  },
  serializeIntoHash: function(hash, typeClass, snapshot, options){
    Object.assign(hash, this.serialize(snapshot, options));
  },
  normalize: function(modelClass, resourceHash) {
    resourceHash.learnLevels = JSON.parse(resourceHash.learnLevels||'{}');
    resourceHash.learnDates = JSON.parse(resourceHash.learnDates||'{}');
    resourceHash.examDates = JSON.parse(resourceHash.examDates||'{}');
    resourceHash.promoteDates = JSON.parse(resourceHash.promoteDates||'{}');
    //resourceHash.translations = resourceHash.translations;
    return this._super(modelClass, resourceHash);
  }
});