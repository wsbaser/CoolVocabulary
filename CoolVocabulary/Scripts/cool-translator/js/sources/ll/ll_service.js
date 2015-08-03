function LLService(provider){
    DictionaryService.call(this, provider.config, provider);
}

LLService.prototype = Object.create(DictionaryService.prototype);

LLService.prototype.getTranslationsHtml = function(translations, inDictionary) {
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
            var linkMarker = chrome.extension.getURL('/images/ll/marker.png');
            var indexAttr = ' ind="'+(ind++)+'" ';
            return '<div class="ll-translation-item" '+indexAttr+'><div class="ll-translation-text" '+indexAttr+'><img class="ll-translation-marker" src="'+linkMarker+'"/><a href="javascript:void 0" '+indexAttr+' >'+htmlHelper.escapeHTML(item.value)+'</a></div><div class="ll-translation-counter">'+item.votes+'</div></div>';
        }).toArray();
    }
    return items.join('');
};

LLService.prototype.getArticleTemplateData = function(response) {
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
        imagesUrl:  chrome.extension.getURL('/images'),
        inDict: response.inDictionary,
        transItems: this.getTranslationsHtml.call(this,response.translations, inDict), //already escaped
        transcription: response.transcription || '---',
        originalWord: originalWord,
        wordHint: inDict ? 'Open word card on LinguaLeo' : '',
        soundUrl: response.soundUrl || '',
        soundHint: 'Listen',
        hasPic: !!response.picUrl,
        picUrl: response.picUrl || chrome.extension.getURL('/images/blank.gif'),
        context: null,
        wordLink: inDict
            ? this.config.domain + templatesHelper.formatStr(this.config.path.wordArticle, {originalWord: originalWord.toLocaleLowerCase()})
            : 'javascript:void(0)',
        resultHint:resultHint,
        baseForm: baseForm
    }
};

LLService.prototype.generateTranslationsCard = function(responseData) {
    // . create content from template
    return strHelper.format(LLService.CARD_TEMPLATE, this.getArticleTemplateData(responseData));
    // . bind events
    // cardEl.find('#lleo_sound').bind('click', function(){ 
    //     this.playSound(responseData);
    // });
    // contentEl.find('#lleo_baseForm').bind('click', LleoHandlers.baseFormClick.bind(this));
    // //Event.add(contentEl.querySelector('#lleo_trans'), 'click', LleoHandlers.clickTranslationsList.bind(this));
    // return contentEl;
};


// LleoHandlers.baseFormClick=function() {
//     var baseForm = this.responseData.word_forms && this.responseData.word_forms.length ?
//         this.responseData.word_forms[0].word :
//         null;
//     if (baseForm)
//         ctrContent.showDialog(baseForm);
//     return false;
// };

// LLService.playSound = function(responseData) {
//     if (ctrContent.canPlayMp3()) {
//         $('#lleo_player').play();
//     } else {

//         var url = this.config.path.audio_player + this.responseData.soundUrl;
//         var htmlFrame = '<iframe src="' + url + '" width="0" height="0" style="width:0 !important; height:0 !important; visibility:hidden !important; border:0 !important; overflow:hidden !important; margin:0 !important; padding:0 !important;" marginwidth="0" marginheight="0" hspace="0" vspace="0" frameborder="0" scrolling="no"></iframe>';
//         $('#lleo_sound').append(htmlFrame);
//     }
//     return false;
// };


LLService.CARD_TEMPLATE =
'<div class="{soundUrl?lleo_has_sound:} {hasPic?lleo_has_pic:} {context?lleo_has_context:}">\
    <div id="lleo_translationsCopntainer1">\
        <div id="lleo_translationsCopntainer2">\
            <div id="lleo_picOuter">\
                <table>\
                    <tr>\
                        <td>\
                            <div>\
                                <img id="lleo_pic" src="{picUrl}" width="30"/>\
                            </div>\
                        </td>\
                    </tr>\
                </table>\
                <img id="lleo_picBig" src="{picUrl}"/>\
            </div>\
            <div id="lleo_inner">\
                <div id="lleo_sound" title="{soundHint}" style="background-image:url(\'{imagesUrl}/sound.png\') !important;">\
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

function notEmpty(obj){
    return !isEmpty(obj);
}

function isEmpty(obj) {
    return length(obj)===0;
}

function length(obj){
    if (obj == null) return 0;
    if (obj.length!=undefined) return obj.length;
    return Object.keys(obj);
}