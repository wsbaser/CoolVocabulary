/**
 * Created by wsbaser on 25.04.2015.
 */
function TfdService(config, provider){
	DictionaryService.call(config, provider);
};

TfdService.prototype = Object.create(DictionaryService.prototype);

TfdService.prototype.generateThesaurusCard = function(contentEl){
	var thesaurusEl = contentEl.find('#Thesaurus');
	this.deactivateLinks(thesaurusEl, 'a');
	return thesaurusEl;
};

TfdService.prototype.generateDefinitionsCard = function(contentEl){
	var thesaurusEl = contentEl.find('#Definitions');
	this.deactivateLinks(thesaurusEl, 'a');
	return thesaurusEl;
};

TfdService.prototype.generateVerbTableCard = function(contentEl){
    // . collect verb tables and remove them from content
    var verbtableSectionElems = [];
    var sectionElems = contentEl.getElementsByTagName('section');
    for (var i = 0; i < sectionElems.length; i++) {
        var sectionEl = sectionElems[i];
        if (sectionEl.attributes['data-src'] &&
            sectionEl.attributes['data-src'].value.indexOf('VerbTbl') != -1) {
            sectionEl.remove();
            verbtableSectionElems.push(sectionEl);
        }
    }

    // . move verb tables to its own block
    var verbTablesEl = null;
    if (verbtableSectionElems.length > 0) {
        verbTablesEl = $('<div/>',{id:this.tabs.Verbtables.id});
        for (var i = 0; i < verbtableSectionElems.length; i++)
            verbTablesEl.appendChild(verbtableSectionElems[i]);
    }


	// . configure pronunciation click event
	var self = this;
    verbTablesEl.find('.pron').each(function (i, pronEl) {
        var onclickValue = pronEl.attributes['onclick'].value;
        pronEl.attr('onclick', "");
        var matchGroups = /pron_key\((\d*)\)/.exec(onclickValue);
        if (matchGroups) {
            pronEl.bind('click', function () {
                self.pron_key(matchGroups[1] == 1);
            });
        }
    });

	// . configure verb table
    verbtablesEl.find('.verbtables').each(function (i, verbtableEl) {
        verbtableEl.attr('onchange', "");
        verbtableEl.bind('change', function () { self.selectVT(); });
    });

	return verbtablesEl;
};

//===== Handlers ===============================================================================================

TfdService.prototype.pron_key = function(isIPA){
    var pkw = open('http://www.thefreedictionary.com/_/pk' + (isIPA? '_ipa' : '') + '.htm', 'pk', 'width=' + (isIPA? '800' : '630') + ',height=' + (isIPA == 1 ? '865' : '710') + ',statusbar=0,menubar=0');
    if (pkw.focus)
        pkw.focus();
    return false;
};

TfdService.prototype.selectVT = function(sel) {
    var v = sel.options[sel.selectedIndex].value;
    if (v == "0")
        return;
    var i = 1, tbl;
    while ((tbl = $("#VerbTableN" + v.split("_")[0] + "_" + i)) != undefined) {
        tbl.attr('class','prettytable hiddenStructure');
        i++;
    }
    $("#VerbTableN" + v).attr('class','prettytable');
};
