 var ContentTypes = {};
ContentTypes.TRANSLATIONS = "translations";
ContentTypes.DEFINITIONS = "definitions";
ContentTypes.THESAURUS = "thesaurus";
ContentTypes.EXAMPLES = "examples";
ContentTypes.PHRASES = "phrases";
ContentTypes.VERBTABLE = "verbtable";

ContentTypes.getTitle = function(contentType){
	switch(contentType){
		case ContentTypes.TRANSLATIONS:
			return 'Translations';
		case ContentTypes.DEFINITIONS:
			return 'Definitions';
		case ContentTypes.THESAURUS:
			return 'Thesaurus';
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

var SpeachParts = {};
SpeachParts.UNKNOWN = 0;
SpeachParts.NOUN = 1;
SpeachParts.VERB = 2;
SpeachParts.ADJECTIVE = 3;
SpeachParts.ADVERB = 4;
