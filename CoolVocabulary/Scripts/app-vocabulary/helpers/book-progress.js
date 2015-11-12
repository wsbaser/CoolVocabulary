Vocabulary.BookProgressHelper = Ember.Helper.helper(function(params){
	var completed = params[0];
	var total = params[1];
	var FULL_WIDTH = 80;
	var progressWidth = total===0?0:Math.round((completed/total)*FULL_WIDTH);
	var html = '<svg>'+
        '<rect x="0" y="0" width="'+FULL_WIDTH+'" height="10" fill="#ebeef2"></rect>'+
        '<rect x="0" y="0" width="'+progressWidth+'" height="10" fill="#39b3d7"></rect>'+
        '</svg>';
    return Ember.String.htmlSafe(html);
});