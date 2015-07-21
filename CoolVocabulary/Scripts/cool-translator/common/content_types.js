 var ContentTypes = {};
ContentTypes.TRANSLATIONS = "translations";
ContentTypes.DEFINITIONS = "definitions";
ContentTypes.EXAMPLES = "examples";
ContentTypes.PHRASES = "phrases";
ContentTypes.VERBTABLE = "verbtable";

ContentTypes.getTytle = function(contentType){
	switch(contentType){
		case ContentTypes.TRANSLATIONS:
			return 'Translations';
		case ContentTypes.DEFINITIONS:
			return 'Definitions';
		case ContentTypes.EXAMPLES:
			return 'Examples';
		case ContentTypes.PHRASES:
			return 'Phrases';
		case ContentTypes.VERBTABLE:
			return 'Verb Table';
		default: 
			throw new Error('Unknown content type');
	}
}