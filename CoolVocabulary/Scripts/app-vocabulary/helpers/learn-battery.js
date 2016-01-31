Vocabulary.LearnBatteryHelper = Ember.Helper.helper(function(params, namedParams){
	// . define min learning level of all translations
	var level=params[0];

	if(level===MAX_LEARN_LEVEL){
		return Ember.String.htmlSafe('<span class="glyphicon glyphicon-ok"/>');
	}
	else{
		var svgBody = '';
		// . generate svg element
		for (var i = 1 ; i <=5; i++) {
			var x = (i-1) * 3;
			var color = level===-1? 
				'#39b3d7': 			// . blue
				(i<=level?
						"#f55":  	// . red
						"#ccc"); 	// . grey
			var style = level===-1 ? 'opacity:0.2' : 'opacity:0.6';
			svgBody += '<rect x="'+ x +'" width="2" height="6" fill="' + color + '" style="'+style+'"></rect>';
		}

		return  Ember.String.htmlSafe('<svg class="learn-battery">' + svgBody + '</svg>');
	}
});