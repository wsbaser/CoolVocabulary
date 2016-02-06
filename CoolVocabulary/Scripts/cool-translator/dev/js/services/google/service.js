'use strict';

import DictionaryService from '../common/dictionary-service';
import ContentTypes from '../common/content-types';
import StringHelper from 'string-helper';
import SpeachParts from '../common/speach-parts';

const TRANSLATIONS_HEADER =
    '<div class="gt-cd-t">' +
    '<span class="gt-card-ttl-txt" style="direction: ltr;">{word}</span>: translations' +
    '</div>';

const TRANSLATIONS_LIST =
    '<div class="gt-cd-c"><table class="gt-baf-table"><tbody>' +
    '<tr><td colspan="4"><div class="gt-baf-cell gt-baf-pos-head"><span class="gt-cd-pos">{pos}</span></div></td></tr>' +
    '{translationsListHtml}' +
    '</tbody></table></div>';

const TRANSLATIONS_ITEM =
    '<tr><td colspan="2"><div class="gt-baf-cell gt-baf-word-clickable">{word}</div></td>' +
    '<td style="width: 100%;">' +
    '<div class="gt-baf-cell gt-baf-translations">{reverseTranslations}</div>' +
    '</td>' +
    '</tr>';
const REVERSE_TRANSLATION = '<span class="gt-baf-back">{word}</span>';

const DEFINITIONS_HEADER =
    '<div class="gt-cd-t">' +
    '<span class="gt-card-ttl-txt" style="direction: ltr;">{word}</span>&nbsp;&ndash; definitions' +
    '</div>';

const DEFINITIONS =
    '<div class="gt-cd-c">' +
    '<div class="gt-cd-pos">{pos}</div>' +
    '<div class="gt-def-list" style="direction: ltr;">{definitionsListHtml}</div>' +
    '</div>';

const DEFINITION_ITEM =
    '<div class="gt-def-info">' +
    '<div class="gt-def-row">{definition}</div>' +
    '<div class="gt-def-example">{example}</div>' +
    '</div>';

const EXAMPLES =
    '<div class="gt-cd-t">Examples</div>' +
    '<div class="gt-cd-c">{examplesListHtml}</div>';

const EXAMPLE_ITEM =
    '<div class="gt-ex-info">' +
    '<div dir="ltr" class="gt-ex-text">{example}</div>' +
    '</div>';

export default class GoogleService extends DictionaryService {
    constructor(provider) {
        super(provider);
        this.cacheResponseData = true;
        this.singleCacheObject = true;
    }

    generateTranslationsCard(data) {
        if (data && data.translations && Object.keys(data.translations).length) {
            let translationsHtml = '';
            for (let sp in data.translations) {
                let spTranslations = data.translations[sp];
                let listHtml = $.map(spTranslations, function(entry) {
                    let reverseTranslationsHtml = $.map(entry.reverse_translation || [], function(word) {
                        return StringHelper.format(REVERSE_TRANSLATION, {
                            word: word
                        });
                    }).join(', ');
                    return StringHelper.format(TRANSLATIONS_ITEM, {
                        word: entry.word,
                        reverseTranslations: reverseTranslationsHtml
                    });
                }).join('');
                translationsHtml += StringHelper.format(TRANSLATIONS_LIST, {
                    pos: sp,
                    translationsListHtml: listHtml
                });
            };
            let headerHtml = StringHelper.format(TRANSLATIONS_HEADER, {
                word: data.word
            });
            let contentEl = $('<section/>', {
                html: headerHtml + translationsHtml
            });
            this.addTranslateContentEvent(contentEl, '.gt-baf-back');
            return contentEl.outerHTML();
        }
        return null;
    }

    generateDefinitionsCard(data) {
        if (data && data.definitions && Object.keys(data.definitions).length) {
            let definitionsHtml = '';
            for (let sp in data.definitions) {
                let spDefinitions = data.definitions[sp];
                if (spDefinitions.length) {
                    let listHtml = $.map(spDefinitions, function(item) {
                        return StringHelper.format(DEFINITION_ITEM, {
                            definition: item.definition,
                            example: item.example || ''
                        });
                    }).join('');
                    definitionsHtml += StringHelper.format(DEFINITIONS, {
                        pos: sp,
                        definitionsListHtml: listHtml
                    });
                }
            };
            let headerHtml = StringHelper.format(DEFINITIONS_HEADER, {
                word: data.word
            });

            return $('<section/>', {
                html: headerHtml + definitionsHtml
            }).outerHTML();
        }
        return null;
    }

    generateExamplesCard(data) {
        if (data && data.examples.length > 0) {
            let examplesListHtml = $.map(data.examples, function(example) {
                return StringHelper.format(EXAMPLE_ITEM, {
                    example: example
                });
            }).join('');
            let examplesHtml = StringHelper.format(EXAMPLES, {
                examplesListHtml: examplesListHtml
            });
            return $('<section/>', {
                html: examplesHtml
            }).outerHTML();
        }
        return null;
    }

    getTranslations(inputData) {
        let responseData = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
        let result = {};
        if (responseData && responseData.translations) {
            let translations = {};
            $.each(responseData.translations, function(sp, spTranslations) {
                sp = SpeachParts.parseEn(sp);
                translations[sp] = [];
                for (let i = spTranslations.length - 1; i >= 0; i--) {
                    translations[sp].push(spTranslations[i].word);
                };
            });
            result[inputData.word] = translations;
        }
        return result;
    }

    detectLanguage(word) {
        return this.provider.detectLanguage(word);
    }
}