Vocabulary.WordsCountHelper = Ember.Helper.helper(function(params){
	var count = params[0];
	return count + (count===1?' translation':' translations');
});