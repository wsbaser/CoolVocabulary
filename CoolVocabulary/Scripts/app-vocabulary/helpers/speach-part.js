var SpeachParts = {};
SpeachParts.UNKNOWN = 0;
SpeachParts.NOUN = 1;
SpeachParts.VERB = 2;
SpeachParts.ADJECTIVE = 3;
SpeachParts.ADVERB = 4;

Vocabulary.SpeachPartHelper = Ember.Helper.helper(function(params, namedParams){
	var sp = +params[0];
	var result;
	switch(sp){
		case SpeachParts.NOUN:
			result = 'noun';
			break;
		case SpeachParts.VERB:
			result = 'verb';
			break;
		case SpeachParts.ADJECTIVE:
			result = 'adjective';
			break;
		case SpeachParts.ADVERB:
			result = 'adverb';
			break;
		default:
			return 'unknown';
	}
	if(namedParams.capitalize){
		result = result.capitalize();
	}
	if(namedParams.pluralize){
		result = result.pluralize();
	}
	return result;
});