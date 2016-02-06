'use strict';

import DictionaryService from '../common/dictionary-service';
import ContentTypes from '../common/content-types';
import SpeachParts from '../common/speach-parts';

export default class LingueeService extends DictionaryService {
    constructor(provider){
        super(provider);
    }
    
    removeExpandIcon(el) {
        // TODO: add expanding support later
        el.find('.expand_i').remove();
    }

    generateTranslationsCard(contentEl) {
        let self = this;
        let translationsEl = contentEl.find('.exact').clone();
        this.deactivateLinks(translationsEl, 'a');
        // . Show translation for word
        this.addTranslateContentEvent(translationsEl, '.tag_lemma>.dictLink');
        this._addPlaySoundEvent(translationsEl, '.audio');
        self.addEventData(translationsEl, 'click', 'lingueeHandlers.onContentClick');

        // . remove phrases
        translationsEl.find('.example_lines').remove();
        this.removeExpandIcon(translationsEl);
        return translationsEl.outerHTML();
    }

    generatePhrasesCard(contentEl) {
        let phrasesEl = contentEl.find('.example_lines');
        phrasesEl.find('h3').remove();
        this.deactivateLinks(phrasesEl, '.dictLink');
        this.addTranslateContentEvent(phrasesEl, '.dictLink');
        this._addPlaySoundEvent(phrasesEl, '.audio');
        return phrasesEl.outerHTML();
    }

    _addPlaySoundEvent(rootEl, selector) {
        let self = this;
        rootEl.find(selector).each(function(index, audioEl) {
            let onclickFunction = audioEl.attributes['onclick'].value;
            audioEl.removeAttribute('onclick');
            let playSoundArgs = onclickFunction.substring(10, onclickFunction.length - 2).replace('"', '').replace(/"/g, '').split(',');
            let args = [$(audioEl), 'click', 'lingueeHandlers.playSound'].concat(playSoundArgs);
            self.addEventData.apply(this, args);
        });
    }

    get SpeachParts() {
        return {
            en: {
                'noun': SpeachParts.NOUN,
                'verb': SpeachParts.VERB,
                'adjective': SpeachParts.ADJECTIVE,
                'adverb': SpeachParts.ADVERB
            }
        };
    }

    parseSpeachPart(text, language) {
        let dict = this.SpeachParts[language] || this.SpeachParts.en;
        return dict[text] ? dict[text] : SpeachParts.UNKNOWN;
    }

    getTranslations(inputData) {
        let self = this;
        let card = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
        let result = {};
        if (card) {
            let translationsEl = $(card);
            let lemmaList = translationsEl.find('.lemma');
            for (let i = lemmaList.length - 1; i >= 0; i--) {
                let el = $(lemmaList[i]);
                let translations = {};
                let lemma = el.find('.dictLink,.dictTerm').flatText();
                el.find('.tag_trans').each(function(index, tagTransEl) {
                    tagTransEl = $(tagTransEl);
                    let sp = self.parseSpeachPart(tagTransEl.find('.tag_type').attr('title'), inputData.sourceLang);
                    if (!translations[sp])
                        translations[sp] = [];
                    translations[sp].push(tagTransEl.find('.dictLink').text());
                });
                result[lemma] = translations;
            }
        }
        return result;
    }

    getSoundUrls(inputData, translation) {
        let card = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
        let result = [];
        if (card) {
            let translationsList = $(card).find('.tag_trans');
            for (let i = translationsList.length - 1; i >= 0; i--) {
                let translationEl = $(translationsList[i]);
                if (translationEl.find('.dictLink').text() === translation) {
                    let audioEl = translationEl.find('.audio');
                    let eventData = audioEl.data('event');
                    if (eventData) {
                        let args = eventData.split('|');
                        if (args.length >= 5) {
                            for (let i = 3; i < args.length - 1; i += 2) {
                                result.push('http://linguee.com/mp3/' + args[i] + '.mp3');
                            };
                        }
                    }
                    break;
                }
            }
        }
        return result;
    }
}