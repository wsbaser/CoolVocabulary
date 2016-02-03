'use strict';

export default {
	TRANSLATIONS : "translations",
	DEFINITIONS : "definitions",
	THESAURUS : "thesaurus",
	EXAMPLES : "examples",
	PHRASES : "phrases",
	VERBTABLE : "verbtable",
	getTitle : function(contentType){
		switch(contentType){
			case this.TRANSLATIONS:
				return 'Translations';
			case this.DEFINITIONS:
				return 'Definitions';
			case this.THESAURUS:
				return 'Thesaurus';
			case this.EXAMPLES:
				return 'Examples';
			case this.PHRASES:
				return 'Phrases';
			case this.VERBTABLE:
				return 'Verb Table';
			default: 
				throw new Error('Unknown content type');
		}
	}
}