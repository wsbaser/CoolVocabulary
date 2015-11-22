Vocabulary.ObjectsCountHelper = Ember.Helper.helper(function(params){
	var count = params[0];
	var object = params[1];
	return count + ' ' + object + (count===1?'':'s');
});