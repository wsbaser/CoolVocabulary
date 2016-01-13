Vocabulary.User = DS.Model.extend({
	displayName: DS.attr("string"),
	nativeLanguage: DS.belongsTo("language"),
	userBooks: DS.hasMany('userBook')
});