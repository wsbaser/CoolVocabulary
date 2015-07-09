/**
 * Created by wsbaser on 25.04.2015.
 */
// ==UserScript==
// @name TfdContent
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

//===== TfdSource ======================================================================================================
function TfdSource(config,tabsArr,defaultTabId) {
    TfdSource.superclass.constructor.apply(this, arguments);
}

extend(TfdSource,SourceWithTabs,(function(){
    function configureContent(contentEl) {
        // . configure pronunciation click event
        contentEl.find('.pron').each(function (i, pronEl) {
            var onclickValue = pronEl.attributes['onclick'].value;
            pronEl.attr('onclick', "");
            var matchGroups = /pron_key\((\d*)\)/.exec(onclickValue);
            if (matchGroups) {
                pronEl.bind('click', function () {
                    TfdHandlers.pron_key(matchGroups[1] == 1);
                });
            }
        }.bind(this));

        // . configure verb table
        contentEl.find('.verbtables').each(function (i, verbtableEl) {
            verbtableEl.attr('onchange', "");
            verbtableEl.bind('change', function () {
                TfdHandlers.selectVT(this);
            });
        }.bind(this));

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
        if (verbtableSectionElems.length > 0) {
            var verbTablesEl = $('<div/>',{id:this.tabs.Verbtables.id});
            contentEl.appendChild(verbTablesEl);
            for (var i = 0; i < verbtableSectionElems.length; i++)
                verbTablesEl.appendChild(verbtableSectionElems[i]);
        }

        var translationsEl = contentEl.querySelector('#Translations');
        if (translationsEl)
            translationsEl.remove();

        configureWordLinks(contentEl, 'a');
    }

    function configureWordLinks(rootEl, selector) {
        rootEl.find(selector).each(function (i, linkEl) {
            linkEl.attr('href', 'javascript:void(0)');
            linkEl.bind('click', function (e) {
                ctrContent.showDialog(e.target.textContent);
            });
        });
    }

    function configureNoResultsWarning(responseEl) {
        var el = responseEl.getElementsByTagName('div')[0];
        if (el)
            el.style.setProperty('margin', '6px 0 3px 0', 'important');
        configureWordLinks(responseEl, 'a');
    };

    function configureNotAvailableWarning(responseEl) {
        responseEl.find('.br').remove();
        var el = responseEl.getElementsByTagName('div')[0];
        el.style.setProperty('margin', '10px 0', 'important');
        el.find('a').each(function (i, linkEl) {
            linkEl.setAttribute('target', '_blank');
        });
    }

    return {
        tabs:(function() {
            var tabs = {};
            tabs.Thesaurus = new Tab('Thesaurus');
            tabs.Definition = new Tab('Definition', {title: 'Definitions'});
            tabs.Verbtables = new Tab('Verbtables', {title: 'Verb Tables'});
            //tabs.Translations = new Tab('Translations');
            return tabs;
        })(),
        prepare: function(result) {
            // . create content element
            var responseEl = $(result.response);
            responseEl = responseEl.querySelector('#MainTxt');

            if (responseEl.textContent.indexOf('Word not found')!=-1) {
                configureNoResultsWarning.call(this, responseEl);
                this.warningEl.appendChild(responseEl);
            }
            else if(responseEl.textContent.indexOf('is not available')!=-1){
                configureNotAvailableWarning(responseEl);
                this.warningEl.appendChild(responseEl);
            }
            else {
                configureContent.call(this, responseEl);
                // .init tabs
                dictionaryHelper.each(this.tabs, function (id, tab) {
                    tab.init(result.inputData, responseEl.querySelector('#' + id));
                });
            }
        }
    };
})());

//===== Content Handlers ===============================================================================================

TfdHandlers={};
TfdHandlers.pron_key = function(isIPA){
    var pkw = open('http://www.thefreedictionary.com/_/pk' + (isIPA? '_ipa' : '') + '.htm', 'pk', 'width=' + (isIPA? '800' : '630') + ',height=' + (isIPA == 1 ? '865' : '710') + ',statusbar=0,menubar=0');
    if (pkw.focus)
        pkw.focus();
    return false;
};

TfdHandlers.selectVT = function(sel) {
    var v = sel.options[sel.selectedIndex].value;
    if (v == "0")
        return;
    var i = 1, tbl;
    while ((tbl = document.getElementById("VerbTableN" + v.split("_")[0] + "_" + i)) != undefined) {
        tbl.className = "prettytable hiddenStructure";
        i++;
    }
    document.getElementById("VerbTableN" + v).className = "prettytable";
};

//======================================================================================================================

var tfdContent = new TfdSource(TfdConfig(), 'Thesaurus');