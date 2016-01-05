/**
 * Created by wsbaser on 25.04.2015.
 */
function MultitranService(provider){
    DictionaryService.call(this, provider.config, provider);
};

MultitranService.prototype = Object.create(DictionaryService.prototype);

MultitranService.prototype.removeExpandIcon = function(el){
    // TODO: add expanding support later
    el.find('.expand_i').remove();
};

MultitranService.prototype.generateTranslationsCard = function(contentEl){
    var $lines = contentEl.find('tr');
    if($lines.length){
        var translationsEl = $('<table/>');
        for (var i = 0; i < $lines.length; i++) {
            var trEl = $lines[i];
            if(trEl.childNodes.length===1){
                // . it is a line with translated word
                var tdEl = trEl.childNodes[0];
                if(this._isWordDescriptionLine(tdEl)){
                    // . remove unnecessary nodes
                    var children = Array.prototype.slice.call(tdEl.children);
                    for (var j = 3; j<children.length; j++) {
                        tdEl.removeChild(children[j]); 
                    };
                    translationsEl.append(trEl);
                }
                else{
                    break;
                }
            }
            else{
                // . it is a line with translation
                translationsEl.append(trEl);
            }
        };
        this.deactivateLinks(translationsEl, 'a');
        this.addTranslateContentEvent(translationsEl, 'td.gray>a:first-child');
        this.makeStylesImportant(translationsEl, 'span');
        return translationsEl.outerHTML();
    }
};

MultitranService.SpeachParts = {
        'n': SpeachParts.NOUN, 
        'v': SpeachParts.VERB,
        'adj': SpeachParts.ADJECTIVE,
        'adv': SpeachParts.ADVERB
};

MultitranService.prototype.parseSpeachPart = function(text){
    return MultitranService.SpeachParts[text]||SpeachParts.UNKNOWN;
};

MultitranService.prototype._isWordDescriptionLine = function(lineCell){
    return lineCell.children.length>=3 &&
        lineCell.children[0].tagName==='A' &&
        lineCell.children[1].tagName==='SPAN' &&
        lineCell.children[2].tagName==='EM';
};

MultitranService.prototype.getTranslations = function(inputData){
    var self = this;
    var card = this.getCachedCard(inputData,ContentTypes.TRANSLATIONS);
    var result = {};
    if(card){
        var translationsEl = $(card);
        var currentLemma;
        var currentSP = SpeachParts.UNKNOWN;
        var $lines = translationsEl.find('tr');
        for (var i = 0; i<$lines.length; i++) {
            var trEl = $lines[i];
            if(trEl.childNodes.length===1){
                // . it is a line with translated word
                var tdEl = trEl.childNodes[0];
                if(this._isWordDescriptionLine(tdEl)){
                    // . get lemma
                    currentLemma = tdEl.children[0].textContent;                    
                    if(!result[currentLemma]){
                        result[currentLemma] = {};
                    }
                    // . get speach part
                    currentSP = this.parseSpeachPart(tdEl.children[2].textContent);
                    if(!result[currentLemma][currentSP]){
                        result[currentLemma][currentSP] = [];
                    }
                }
                else{
                    // . no more translations. stop parsing
                    break;
                }
            }
            else{
                var transEl = trEl.querySelector('.trans');
                if(transEl){
                    // . it is a line with translations
                    var tranList = Array.prototype.slice.call(transEl.querySelectorAll('a')); 
                    tranList.forEach(function(item){
                        result[currentLemma][currentSP].push(item.textContent);
                    });
                }
                else{
                    // . invalid content. stop parsing
                    break;
                }
            }
        }
    }
    return result;
};