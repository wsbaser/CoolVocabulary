'use strict';

export default {
    UNKNOWN : 0,
    NOUN : 1,
    VERB : 2,
    ADJECTIVE : 3,
    ADVERB : 4,
    PRONOUN : 5,
    PREPOSITION : 6,
    CONJUNCTION : 7,
    INTERJECTION : 8,
    parseEn : function(sp){
        switch(sp.toLowerCase()){
            case 'noun':
                return this.NOUN;
            case 'verb':
                return this.VERB;
            case 'adjective':
                return this.ADJECTIVE;
            case 'adverb':
                return this.ADVERB;
            case 'pronoun':
                return this.PRONOUN;
            case 'preposition':
                return this.PREPOSITION;
            case 'conjunction':
                return this.CONJUNCTION;
            case 'interjection':
                return this.INTERJECTION;
            default:
                return this.UNKNOWN; 
        }
    },
    toStringEn: function(sp){
        sp = +sp;
        switch(sp){
            case this.NOUN:
                return 'noun';
            case this.VERB:
                return 'verb';
            case this.ADJECTIVE:
                return 'adjective';
            case this.ADVERB:
                return 'adverb';
            default:
                return 'unknown';
        }
    }
}