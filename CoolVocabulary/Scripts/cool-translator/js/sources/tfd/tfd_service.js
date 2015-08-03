/**
 * Created by wsbaser on 25.04.2015.
 */
function TfdService(provider){
	DictionaryService.call(this, provider.config, provider);
};

TfdService.prototype = Object.create(DictionaryService.prototype);

TfdService.prototype.generatePrompts = function(contentType, contentEl){
    if (contentEl.text().indexOf('Word not found')!=-1) {
        this._configureNoResultsWarning(contentEl);
        return contentEl;
    }
    else if(contentEl.text().indexOf('is not available')!=-1){
        this._configureNotAvailableWarning(contentEl);
        return contentEl.outerHTML();
    }
    return null;
};

TfdService.prototype._configureNoResultsWarning = function(responseEl) {
    var el = responseEl.find('div')[0];
    if (el.length)
        el[0].style.setProperty('margin', '6px 0 3px 0', 'important');
    configureWordLinks(responseEl, 'a');
};

TfdService.prototype._configureNotAvailableWarning = function(responseEl) {
    responseEl.find('.br').remove();
    var el = responseEl.find('div')[0];
    el[0].style.setProperty('margin', '10px 0', 'important');
    el.find('a').each(function (i, linkEl) {
        $(linkEl).attr('target', '_blank');
    });
};

TfdService.prototype.generateThesaurusCard = function(contentEl){
	var thesaurusEl = contentEl.find('#Thesaurus');
	this.deactivateLinks(thesaurusEl, 'a');
	return thesaurusEl.outerHTML();
};

TfdService.prototype.generateDefinitionsCard = function(contentEl){
    var self = this;
	var definitionEl = contentEl.find('#Definition');
	this.deactivateLinks(definitionEl, 'a');
    // . configure pronunciation click event
    definitionEl.find('.pron').each(function (i, pronEl) {
        pronEl = $(pronEl);
        var onclickValue = pronEl.attr('onclick');
        pronEl.removeAttr('onclick');
        var matchGroups = /pron_key\((\d*)\)/.exec(onclickValue);
        if (matchGroups)
            this.addEventData(pronEl,'click','pron_key', matchGroups[1])
    }.bind(this));

	return definitionEl.outerHTML();
};

TfdService.prototype.generateVerbtableCard = function(contentEl){
    // . collect verb tables and remove them from content
    var verbtableSectionElems = [];
    $.each(contentEl.find('section'), function(i, sectionEl){
        sectionEl = $(sectionEl);
        if (sectionEl.attr('data-src') &&
            sectionEl.attr('data-src').indexOf('VerbTbl') != -1) {
            sectionEl.remove();
            verbtableSectionElems.push(sectionEl);
        }
    });

    // . move verb tables to its own block
    if( verbtableSectionElems.length){
        var verbTablesEl = $('<div/>', { id: 'Verbtables' });
        for (var i = 0; i < verbtableSectionElems.length; i++)
            verbTablesEl.append(verbtableSectionElems[i]);

    	// . configure verb table
        $.each(verbTablesEl.find('.verbtables'), function(i, verbtableEl) {
            verbtableEl = $(verbtableEl);
            verbtableEl.removeAttr('onchange');
            this.addEventData(verbtableEl, 'change', 'SelectVT', 'this');
            console.log(verbtableEl.outerHTML());
        }.bind(this));
        
    	return verbTablesEl.outerHTML();
    }
    else
        return null;
};

//===== Handlers ===============================================================================================