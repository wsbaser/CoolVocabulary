'use strict';

import DictionaryService from '../common/dictionary-service';
import ContentTypes from '../common/content-types';
import StringHelper from 'string-helper';
import SpeachParts from '../common/speach-parts';


const CARD_TEMPLATE =
    '<div class="{soundUrl?lleo_has_sound:} {hasPic?lleo_has_pic:} {context?lleo_has_context:}">\
    <div id="lleo_translationsCopntainer1">\
        <div id="lleo_translationsCopntainer2">\
            <div id="lleo_picOuter">\
                <img id="lleo_pic" src="{picUrl}" width="30"/>\
                <img id="lleo_picBig" src="{picUrl}"/>\
            </div>\
            <div id="lleo_inner">\
                <div id="lleo_sound" title="{soundHint}">\
                    <audio id="lleo_player"><source type="audio/mpeg" src="{soundUrl}"></audio>\
                </div>\
                <div id="lleo_word">\
                    <a id="lleo_text" href="{wordLink}" title="{wordHint}" target="_blank" class="{inDict?lleo_known:}">{originalWord}</a>\
                    <span class="{inDict?:lleo_no_trans}">{resultHint}</span>\
                    <a id="lleo_baseForm" href="#" class="infinitive {baseForm?:hidden}">{baseForm}</a>\
                </div>\
                <div id="lleo_transcription">[{transcription}]</div>\
                <div id="lleo_trans">{transItems}</div>\
                <div class="lleo_clearfix">.</div>\
            </div>\
        </div>\
    </div>\
</div>';

export default class LLService extends DictionaryService {
    constructor(provider) {
        super(provider);
        this.cacheResponseData = true;
    }

    getTranslationsHtml(translations, inDictionary) {
        // Create translation items, limit by 5 options
        let items = [];
        //translations = arrayHelper.convertFromObject(translations);
        if (notEmpty(translations)) {
            let ind = 0;

            // Cut off the first translation if it's a current word translation
            // (current translation always goes first in list)
            if (inDictionary) {
                translations.splice(0, 1);
                ind++;
            }
            // Limit by 5 translations if more
            if (length(translations) > 5)
                translations = translations.slice(0, 5);

            items = $.map(translations, function(item) {
                let linkMarker = chrome.extension.getURL('assets/images/ll/marker.png');
                let indexAttr = ' ind="' + (ind++) + '" ';
                return '<div class="ll-translation-item" ' + indexAttr + '><div class="ll-translation-text" ' + indexAttr + '><img class="ll-translation-marker" src="' + linkMarker + '"/><a href="javascript:void 0" ' + indexAttr + ' >' + item.value + '</a></div><div class="ll-translation-counter">' + item.votes + '</div></div>';
            });
        }
        return items.join('');
    }

    getArticleTemplateData(response) {
        let inDict = response.inDictionary;
        let hasTranslation = notEmpty(response.translate);
        let originalWord = response.inputData.word;
        let baseForm = null;
        if (notEmpty(response.word_forms)) {
            if (StringHelper.trimText(originalWord.toLowerCase()) != StringHelper.trimText(response.word_forms[0].word.toLowerCase()))
                baseForm = response.word_forms[0].word;
        }

        let resultHint = "&nbsp;&mdash;&nbsp;";
        if (baseForm)
            resultHint += 'dictionary form:';
        else if (inDict)
            resultHint += response.translate[0].value;
        else if (hasTranslation)
            resultHint = '';
        else
            resultHint += 'no translation.';

        return {
            inDict: response.inDictionary,
            transItems: this.getTranslationsHtml.call(this, response.translate, inDict), //already escaped
            transcription: response.transcription || '---',
            originalWord: originalWord,
            wordHint: inDict ? 'Open word card on LinguaLeo' : '',
            soundUrl: response.sound_url || '',
            soundHint: 'Listen',
            hasPic: !!response.pic_url,
            picUrl: response.pic_url || chrome.extension.getURL('assets/images/ll/blank.gif'),
            context: null,
            wordLink: inDict ? this.config.domain + templatesHelper.formatStr(this.config.path.wordArticle, {
                originalWord: originalWord.toLocaleLowerCase()
            }) : 'javascript:void(0)',
            resultHint: resultHint,
            baseForm: baseForm
        }
    }

    generateTranslationsCard(responseData) {
        let contentEl = $(StringHelper.format(CARD_TEMPLATE, this.getArticleTemplateData(responseData)));

        // .play sound click
        this.addEventData(contentEl.find('#lleo_sound'), 'click', 'llHandlers.play_sound', 'this');
        // .show base form click 
        this.addTranslateContentEvent(contentEl, '#lleo_baseForm');

        return contentEl.outerHTML();
    }

    checkAuthentication() {
        let deferred = $.Deferred();
        if (localStorage.isLLAuthenticated === 'true')
            deferred.resolve(true);
        else {
            this.provider.checkAuthentication().done(function(data) {
                    if (data.error_msg) {
                        localStorage.isLLAuthenticated = false;
                        deferred.resolve(false);
                        console.error(error_msg);
                    } else {
                        localStorage.isLLAuthenticated = data.is_authorized;
                        deferred.resolve(data.is_authorized);
                    }
                })
                .fail(function(error) {
                    localStorage.isLLAuthenticated = false;
                    deferred.resolve(false);
                    console.error(error);
                });
        }
        return deferred.promise();
    }

    login(username, password) {
        let deferred = $.Deferred();
        this.provider.login(username, password).done(function(data) {
            localStorage.isLLAuthenticated = true;
            deferred.resolve(data);
        }).fail(function(error) {
            deferred.reject(error);
        });
        return deferred;
    }

    addTranslation(inputData, translation) {
        return this.provider.addTranslation(inputData.word, translation);
    }

    getSoundUrls(inputData) {
        let responseData = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
        return responseData && responseData.sound_url ?
            [responseData.sound_url] :
            [];
    }

    getPictureUrls(inputData) {
        let responseData = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
        return responseData && responseData.pic_url ?
            [responseData.pic_url] :
            [];
    }

    getTranslations(inputData) {
        let responseData = this.getCachedCard(inputData, ContentTypes.TRANSLATIONS);
        let result = {};
        if (responseData && responseData.translate) {
            let translations = {};
            translations[SpeachParts.UNKNOWN] = [];
            $.each(responseData.translate, function(i, translation) {
                translations[SpeachParts.UNKNOWN].push(translation.value);
            });
            result[inputData.word] = translations;
        }
        return result;
    }
}

function notEmpty(obj) {
    return !isEmpty(obj);
}

function isEmpty(obj) {
    return length(obj) === 0;
}

function length(obj) {
    if (obj == null) return 0;
    if (obj.length != undefined) return obj.length;
    return Object.keys(obj);
}