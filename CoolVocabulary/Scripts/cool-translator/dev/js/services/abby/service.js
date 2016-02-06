'use strict';

import DictionaryService from '../common/dictionary-service';
import ContentTypes from '../common/content-types';
import SpeachParts from '../common/speach-parts';

export default class AbbyService extends DictionaryService {
    constructor(provider){
        super(provider);
    }
    
    generateTranslationsPrompts(contentEl) {
        console.log('AbbyService.prototype.generateTranslationsPrompts not implemented');
        return null;
    }

    generateTranslationsCard(contentEl) {
        if (contentEl.length) {
            // . correct transcription image "src" attribute
            $.each(contentEl.find('.l-article__transcription'), function(i, el) {
                el = $(el);
                var src = el.attr('src')
                if (src.indexOf('http') !== 0)
                    el.attr('src', this.config.domain + src);
            }.bind(this));

            // . Remove navigation panel
            contentEl.find('.l-article__navpanel').remove();

            // . Remove title from translations
            contentEl.find('.l-article__showExamp').each(function(i, itemEl) {
                itemEl = $(itemEl);
                itemEl.attr('title', '');
                itemEl.attr('href', 'javascript:void(0)');
            });

            // . deactivate links
            this.deactivateLinks(contentEl, '.l-article__commentlink');
            // . Show translation for word
            this.addTranslateContentEvent(contentEl, '.l-article__commentlink');
        }
        return contentEl.outerHTML();
    }

    generateExamplesCard(contentEl) {
        if (contentEl.length) {
            // . remove 'bad example' button
            contentEl.find('.l-examples__badexamp').remove();
            // . correct images "src" attribute
            this.set1pxAsSrc(contentEl, 'l-examples__switchbtn');
            // . configure
            contentEl.find('.js-examples-table-switchbtn').each(function(i, btnEl) {
                btnEl = $(btnEl);
                this.addEventData(btnEl, 'click', 'abbyHandlers.show_example_source', 'this');
            }.bind(this));
            var containerEl = $('<div/>', {
                'class': 'ctr-examples-container'
            });
            containerEl.append(contentEl);
            return containerEl.outerHTML();
        }
        return "";
    }

    generatePhrasesCard(contentEl) {
        if (contentEl.length) {
            // . correct images "src" attribute
            this.set1pxAsSrc(contentEl, 'g-tblresult__pointer');
            // . remove last column
            contentEl.find('.l-phrases__tblphrase__td').remove();
            // . remove duplicate rows
            var rows = contentEl.find('.js-phrases-table tr');
            var prevTransl, prevSrcword;
            for (var i = 0; i < rows.length; i++) {
                var srcwordEl = rows[i].find('.srcwords');
                var translEl = rows[i].find('.transl');
                if (!srcwordEl || !translEl)
                    continue;
                var srcword = srcwordEl.text().trim();
                var transl = translEl.text().trim();
                if (prevTransl === transl && prevSrcword === srcword)
                    rows[i].remove();
                prevTransl = transl;
                prevSrcword = srcword;
            }
            this.deactivateLinks(contentEl, '.l-phrases__link');
            this.addTranslateContentEvent(contentEl, '.l-phrases__link');

            var containerEl = $('<div/>', {
                'class': 'ctr-phrases-container'
            });
            containerEl.append(contentEl);
            return containerEl.outerHTML();
        }
        return "";
    }

    parseSpeachPart(text) {
        switch (text) {
            case "сущ.":
                return SpeachParts.NOUN;
            case "гл.":
                return SpeachParts.VERB;
            case "прил.":
                return SpeachParts.ADJECTIVE;
            case "нареч.":
                return SpeachParts.ADVERB;
            default:
                return SpeachParts.UNKNOWN;
        }
    }

    getTranslations(inputData) {
        var self = this;
        var card = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
        var translations = {};
        var result = {};
        if (card) {
            var translationsEl = $(card);
            var word = translationsEl.find('.g-card>h2>span').text();
            var currentSP = SpeachParts.UNKNOWN;
            translationsEl.find('p').each(function(i, el) {
                el = $(el);
                var abbrevs = el.find('.l-article__abbrev');
                var sp = self.parseSpeachPart(abbrevs[0] ? abbrevs[0].textContent : '');
                if (sp != SpeachParts.UNKNOWN) {
                    currentSP = sp;
                }
                if (!translations[currentSP]) {
                    translations[currentSP] = [];
                }
                el.find('a.js-show-examples').each(function(j, translationEl) {
                    translations[currentSP].push(translationEl.textContent);
                });
            });
            result[word] = translations;
        }
        return result;
    }
}