Vocabulary.UserBook = DS.Model.extend({
    book: DS.belongsTo("book"),
    user: DS.attr("string"),
	learnLevels: DS.attr("string"),
	learnDates: DS.attr("string"),
	examDates: DS.attr("string"),
	firstPromoteDates: DS.attr("string"),
	lastPromoteDates: DS.attr("string")
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
  normalizeResponse: function(store, primaryType, payload, id, requestType) {
    var userBooks = payload.userBooks;
    if(userBooks&&userBooks.length){
		userBooks.forEach(function(item){
		    item.learnLevels = JSON.parse(item.learnLevels);
		    item.learnDates = JSON.parse(item.learnDates);
		    item.examDates = JSON.parse(item.examDates);
		    item.firstPromoteDates = JSON.parse(item.firstPromoteDates);
		    item.lastPromoteDates = JSON.parse(item.lastPromoteDates);
		});
    }
    return this._super(store, primaryType, payload, id, requestType);
  }
});