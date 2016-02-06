'use strict';

import DictionaryService from '../common/dictionary-service';
import ContentTypes from '../common/content-types';
import SpeachParts from '../common/speach-parts';

export default class MultitranService extends DictionaryService {
    constructor(provider){
        super(provider);
    }
    
    removeExpandIcon(el) {
        // TODO: add expanding support later
        el.find('.expand_i').remove();
    }

    generateTranslationsCard(contentEl) {
        let $lines = contentEl.find('tr');
        if ($lines.length) {
            let translationsFragment = document.createDocumentFragment();
            for (let i = 0; i < $lines.length; i++) {
                let trEl = $lines[i];
                if (trEl.childNodes.length === 1) {
                    // . it is a line with translated word
                    let tdEl = trEl.childNodes[0];
                    if (this._isWordDescriptionLine(tdEl)) {
                        // . remove unnecessary nodes
                        let children = Array.prototype.slice.call(tdEl.children);
                        let removeStart = children[1].tagName === "EM" ? 2 : 3;
                        for (let j = removeStart; j < children.length; j++) {
                            tdEl.removeChild(children[j]);
                        };
                        translationsFragment.appendChild(trEl);
                    } else {
                        break;
                    }
                } else {
                    // . it is a line with translation
                    translationsFragment.appendChild(trEl);
                }
            };
            if (!translationsFragment.childElementCount) {
                return null;
            }
            let translationsEl = $('<table/>');
            translationsEl.append(translationsFragment);
            this.deactivateLinks(translationsEl, 'a');
            this.addTranslateContentEvent(translationsEl, 'td.gray>a:first-child');
            this.makeStylesImportant(translationsEl, 'span');
            return translationsEl.outerHTML();
        }
    }

    get SpeachParts() {
        return {
            'n': SpeachParts.NOUN,
            'v': SpeachParts.VERB,
            'adj': SpeachParts.ADJECTIVE,
            'adv': SpeachParts.ADVERB
        }
    }

    parseSpeachPart(text) {
        return this.SpeachParts[text] || SpeachParts.UNKNOWN;
    }

    _getSpeachPartText(lineCell) {
        let children = lineCell.children;
        return children[1] && children[1].tagName === 'EM' ?
            children[1].textContent :
            (children[2] && children[2].tagName === 'EM' ? children[2].textContent : null);
    }

    _isWordDescriptionLine(lineCell) {
        return this._getSpeachPartText(lineCell) &&
            lineCell.children[0] && lineCell.children[0].tagName === 'A';
    }

    getTranslations(inputData) {
        let self = this;
        let card = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
        let result = {};
        if (card) {
            let translationsEl = $(card);
            let currentLemma;
            let currentSP = SpeachParts.UNKNOWN;
            let $lines = translationsEl.find('tr');
            for (let i = 0; i < $lines.length; i++) {
                let trEl = $lines[i];
                if (trEl.childNodes.length === 1) {
                    // . it is a line with translated word
                    let tdEl = trEl.childNodes[0];
                    if (this._isWordDescriptionLine(tdEl)) {
                        // . get lemma
                        currentLemma = tdEl.children[0].textContent;
                        if (!result[currentLemma]) {
                            result[currentLemma] = {};
                        }
                        // . get speach part
                        currentSP = this.parseSpeachPart(this._getSpeachPartText(tdEl));
                        if (!result[currentLemma][currentSP]) {
                            result[currentLemma][currentSP] = [];
                        }
                    } else {
                        // . no more translations. stop parsing
                        break;
                    }
                } else {
                    let transEl = trEl.querySelector('.trans');
                    if (transEl) {
                        // . it is a line with translations
                        let tranList = Array.prototype.slice.call(transEl.querySelectorAll('a'));
                        tranList.forEach(function(item) {
                            result[currentLemma][currentSP].push(item.textContent);
                        });
                    } else {
                        // . invalid content. stop parsing
                        break;
                    }
                }
            }
        }
        return result;
    }
}