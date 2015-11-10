Vocabulary.PromoteBatteryHelper = Ember.Helper.helper(function(params, namedParams){
	var learnLevel = +params[0];

	// . generate svg element
	var svgBody = '';
	for (var i = 1 ; i <=MAX_LEARN_LEVEL; i++) {
		var x = (i-1) * 6;
		var color = learnLevel===MAX_LEARN_LEVEL ? '#5cb85c': // . green
			(i>learnLevel?
				"#ccc":     // . grey
				"#f55");	// . red
		var style = (learnLevel!==MAX_LEARN_LEVEL && i===learnLevel) ? 'opacity:0.9' : 'opacity:0.6';
		svgBody += '<rect x="'+ x +'" width="4" height="16" fill="' + color + '" style="'+ style +'"></rect>';
	}
	return  Ember.String.htmlSafe('<svg class="promote-battery">' + svgBody + '</svg>');
});