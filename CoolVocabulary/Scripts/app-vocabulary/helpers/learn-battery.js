Vocabulary.LearnBatteryHelper = Ember.Helper.helper(function(params, namedParams){
	var bookWord = params[0];

	// . define min learning level of all translations
	var minLevel=4;
	bookWord.get('translations').forEach(function(item){
		var translationLevel = item.get('learnLevel') || 0;
		if(translationLevel<minLevel){
			minLevel = translationLevel;
		}
	});

	// . generate svg element
	var svgBody = '';
	for (var i = 0 ; i <5; i++) {
		var x = i * 3;
		var color = minLevel===0?
			'#5bc0de': // .blue
			(minLevel>i?
				"#f55":  // . red
				"#aaa"); // . grey 
		svgBody += '<rect x="'+ x +'" width="2" height="6" fill="' + color + '"></rect>';
	}
	return  Ember.String.htmlSafe("<svg>" + svgBody + "</svg>");
});