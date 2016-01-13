Vocabulary.UserBook = DS.Model.extend({
  book: DS.belongsTo("book"),
  user: DS.belongsTo("user"),
	learnLevels: DS.attr("string"),
	learnDates: DS.attr("string"),
	examDates: DS.attr("string"),
	firstPromoteDates: DS.attr("string"),
	lastPromoteDates: DS.attr("string"),
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
    json.firstPromoteDates = JSON.stringify(json.firstPromoteDates);
    json.lastPromoteDates = JSON.stringify(json.lastPromoteDates);
    return json;
  },
  normalize: function(modelClass, resourceHash) {
    resourceHash.learnLevels = JSON.parse(resourceHash.learnLevels)||{};
    resourceHash.learnDates = JSON.parse(resourceHash.learnDates)||{};
    resourceHash.examDates = JSON.parse(resourceHash.examDates)||{};
    resourceHash.firstPromoteDates = JSON.parse(resourceHash.firstPromoteDates)||{};
    resourceHash.lastPromoteDates = JSON.parse(resourceHash.lastPromoteDates)||{};
    return this._super(modelClass, resourceHash);
  }
});