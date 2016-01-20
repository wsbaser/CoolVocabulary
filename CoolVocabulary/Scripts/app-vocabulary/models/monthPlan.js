Vocabulary.MonthPlan = DS.Model.extend({
	user: DS.belongsTo("user"),
    year: DS.attr("number"),
    month: DS.attr("number"),
    language: DS.belongsTo("language"),
    plan: DS.attr("number"),
    done: DS.attr("number")
});