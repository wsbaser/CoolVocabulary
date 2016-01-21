Vocabulary.MonthPlan = DS.Model.extend({
	user: DS.belongsTo("user"),
    year: DS.attr("number"),
    month: DS.attr("number"),
    language: DS.belongsTo("language"),
    planedCount: DS.attr("number"),
    leanedCount: DS.attr("number")
});