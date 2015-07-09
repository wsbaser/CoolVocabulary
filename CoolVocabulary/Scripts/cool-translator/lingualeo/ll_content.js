/**
 * Created by wsbaser on 05.03.2015.
 */
/**
 * Created by wsbaser on 05.03.2015.
 */
// ==UserScript==
// @name LingualeoContent
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

/**
 * @requires utils.js
 * @requires content_utils.js
 * @requires content_source.js
 */

//===== LleoSource =====================================================================================================

function LleoSource(config, defaultTabId) {
    LleoSource.superclass.constructor.apply(this, arguments);
};

extend(LleoSource,Source,(function() {
    function getTranslationsHtml(translations, inDictionary) {
        // Create translation items, limit by 5 options
        var items = [];
        //translations = arrayHelper.convertFromObject(translations);
        if (notEmpty(translations)) {
            var ind = 0;

            // Cut off the first translation if it's a current word translation
            // (current translation always goes first in list)
            if (inDictionary) {
                translations.splice(0, 1);
                ind++;
            }
            // Limit by 5 translations if more
            if (length(translations) > 5)
                translations = translations.slice(0, 5);

            items = $(translations).map(function(item) {
                var linkMarker = ctrContent.config.path.images + '/ll/marker.png';
                var indexAttr = ' ind="'+(ind++)+'" ';
                return '<div class="ll-translation-item" '+indexAttr+'><div class="ll-translation-text" '+indexAttr+'><img class="ll-translation-marker" src="'+linkMarker+'"/><a href="javascript:void 0" '+indexAttr+' >'+htmlHelper.escapeHTML(item.value)+'</a></div><div class="ll-translation-counter">'+item.votes+'</div></div>';
            }).toArray();
        }
        return items.join('');
    };

    function getArticleTemplateData(response) {
        var inDict = response.inDictionary;
        var hasTranslation = notEmpty(response.translations);
        var originalWord = response.inputData.word;
        var baseForm = null;
        if (notEmpty(response.word_forms)) {
            if (strHelper.trimText(originalWord.toLowerCase()) != strHelper.trimText(response.word_forms[0].word.toLowerCase()))
                baseForm = response.word_forms[0].word;
        }

        var resultHint = "&nbsp;&mdash;&nbsp;";
        if(baseForm)
            resultHint += 'dictionary form:';
        else if(inDict)
            resultHint += response.translations[0].value;
        else if(hasTranslation)
            resultHint='';
        else
            resultHint += 'no translation.';

        return {
            imagesUrl: ctrContent.config.path.images,
            inDict: response.inDictionary,
            transItems: getTranslationsHtml.call(this,response.translations, inDict), //already escaped
            transcription: response.transcription || '---',
            originalWord: originalWord,
            wordHint: inDict ? 'Open word card on LinguaLeo' : '',
            optionsBtnHint: 'Settings',
            soundUrl: response.soundUrl || '',
            soundHint: 'Listen',
            hasPic: !!response.picUrl,
            picUrl: response.picUrl || ctrContent.config.path.images + '/blank.gif',
            translateContextHint: 'Translate',
            context: null,
            wordLink: inDict
                ? ctrContent.config.domain + templatesHelper.formatStr(llContent.config.path.wordArticle, {originalWord: originalWord.toLocaleLowerCase()})
                : 'javascript:void 0',
            resultHint:resultHint,
            baseForm: baseForm
        }
    };

    function initArticleEl(responseData, htmlTemplate) {
        this.articleEl.innerHTML = '';
        this.articleEl.appendChild(createContentElement.call(this, responseData, htmlTemplate));
        this.articleEl.appendChild(this._addTranslation.createElement());
        this._addTranslation.connectTranslationsList(this, 'll-translation-item', 'll-translation-text');
    };

    function createContentElement(responseData,htmlTemplate) {
        // . create content from template
        var html = strHelper.format(htmlTemplate, getArticleTemplateData.call(this, responseData));
        var contentEl = $(html);

        // . bind events
        contentEl.find('#lleo_sound').bind('click', LleoHandlers.playSound.bind(this));
        contentEl.find('#lleo_baseForm').bind('click', LleoHandlers.baseFormClick.bind(this));
        //Event.add(contentEl.querySelector('#lleo_trans'), 'click', LleoHandlers.clickTranslationsList.bind(this));
        return contentEl;
    };

    return {
        init: function() {
            LleoSource.superclass.init.call(this);
            this._addTranslation = new AddTranslationControl();
        },
        prepare: function (result,oncomplete) {
            this.data = result.inputData;
            this.responseData = result;
            templatesHelper.getTemplate('contentTranslations', function (htmlTemplate) {
                initArticleEl.call(this, this.responseData, htmlTemplate);
                oncomplete();
            }.bind(this));
        }
    };
})());

//===== LleoHandlers ================================================================================================

LleoHandlers = {};

LleoHandlers.baseFormClick=function() {
    var baseForm = this.responseData.word_forms && this.responseData.word_forms.length ?
        this.responseData.word_forms[0].word :
        null;
    if (baseForm)
        ctrContent.showDialog(baseForm);
    return false;
};

LleoHandlers.playSound=function() {
    if (ctrContent.canPlayMp3()) {
        document.getElementById('lleo_player').play();
    } else {
        var url = this.config.path.audio_player + this.responseData.soundUrl;
        var htmlFrame = '<iframe src="' + url + '" width="0" height="0" style="width:0 !important; height:0 !important; visibility:hidden !important; border:0 !important; overflow:hidden !important; margin:0 !important; padding:0 !important;" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no"></iframe>';
        $('#lleo_sound').append(htmlFrame);
    }
    return false;
};

//======================================================================================================================

var llContent = new LleoSource(LinguaLeoConfig());