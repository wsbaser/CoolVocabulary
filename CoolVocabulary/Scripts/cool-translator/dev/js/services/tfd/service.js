'use strict';

import DictionaryService from '../common/dictionary-service';
import ContentTypes from '../common/content-types';
import SpeachParts from '../common/speach-parts';

export default class TfdService extends DictionaryService {
    constructor(provider){
        super(provider);
    }
    
    generatePrompts(contentType, contentEl) {
        if (contentEl.text().indexOf('Word not found') != -1) {
            this._configureNoResultsWarning(contentEl);
            return contentEl.outerHTML();
        } else if (contentEl.text().indexOf('is not available') != -1) {
            this._configureNotAvailableWarning(contentEl);
            return contentEl.outerHTML();
        }
        return null;
    }

    _configureNoResultsWarning(responseEl) {
        let el = responseEl.find('div');
        if (el.length)
            el[0].style.setProperty('margin', '6px 0 3px 0', 'important');
        this.deactivateLinks(responseEl, 'a');
        this.addTranslateContentEvent(responseEl, 'a');
    }

    _configureNotAvailableWarning(responseEl) {
        responseEl.find('br').remove();
        let el = responseEl.find('div');
        el[0].style.setProperty('margin', '10px 0', 'important');
        el.find('a').each(function(i, linkEl) {
            $(linkEl).attr('target', '_blank');
        });
    }

    generateThesaurusCard(contentEl) {
        let thesaurusEl = contentEl.find('#Thesaurus');
        this.deactivateLinks(thesaurusEl, 'a');
        this.addTranslateContentEvent(thesaurusEl, 'a');
        return thesaurusEl.outerHTML();
    }

    generateDefinitionsCard(contentEl) {
        let self = this;
        let definitionEl = $(contentEl.find('#Definition').outerHTML());
        this.deactivateLinks(definitionEl, 'a');
        this.addTranslateContentEvent(definitionEl, 'a');
        // . configure pronunciation click event
        definitionEl.find('.pron').each(function(i, pronEl) {
            pronEl = $(pronEl);
            let onclickValue = pronEl.attr('onclick');
            pronEl.removeAttr('onclick');
            let matchGroups = /pron_key\((\d*)\)/.exec(onclickValue);
            if (matchGroups)
                this.addEventData(pronEl, 'click', 'tfdHandlers.pron_key', matchGroups[1])
        }.bind(this));

        let verbtableSectionElems = this._getVerbTableSections(definitionEl);
        verbtableSectionElems.forEach(function(sectionEl) {
            sectionEl.remove();
        });

        return definitionEl.outerHTML();
    }

    _getVerbTableSections(contentEl) {
        // . collect verb tables and remove them from content
        let verbtableSectionElems = [];
        $.each(contentEl.find('section'), function(i, sectionEl) {
            sectionEl = $(sectionEl);
            if (sectionEl.attr('data-src') &&
                sectionEl.attr('data-src').indexOf('VerbTbl') != -1) {
                verbtableSectionElems.push(sectionEl);
            }
        });
        return verbtableSectionElems;
    }

    generateVerbtableCard(contentEl) {
        let verbtableSectionElems = this._getVerbTableSections(contentEl);

        // . move verb tables to its own block
        if (verbtableSectionElems.length) {
            let verbTablesEl = $('<div/>', {
                id: 'Verbtables'
            });
            for (let i = 0; i < verbtableSectionElems.length; i++)
                verbTablesEl.append(verbtableSectionElems[i]);

            // . configure verb table
            $.each(verbTablesEl.find('.verbtables'), function(i, verbtableEl) {
                verbtableEl = $(verbtableEl);
                verbtableEl.removeAttr('onchange');
                this.addEventData(verbtableEl, 'change', 'tfdHandlers.SelectVT', 'this');
            }.bind(this));

            return verbTablesEl.outerHTML();
        } else
            return null;
    }

    getPronunciation(inputData) {
        let card = this.getCachedCard(inputData, ContentTypes.DEFINITIONS);
        let pronunciation = null;
        if (card) {
            let definitionsEl = $(card);
            let pronEl = definitionsEl.find('section[data-src="hc_dict"] .pron');
            if (pronEl.length)
                pronunciation = pronEl[0].textContent.trim();
        }
        return pronunciation;
    }

    getPictureUrls(inputData) {
        let card = this.getCachedCard(inputData, ContentTypes.THESAURUS);
        let urls = [];
        if (card) {
            let thesaurusEl = $(card);
            thesaurusEl.find('img').each(function(i, imgEl) {
                urls.push($(imgEl).prop('src'));
            });
        }
        return urls;
    }
}