/**
 * Created by wsbaser on 25.04.2015.
 */
// ==UserScript==
// @name TfdConfig
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

var TfdConfig = function() {
    var rootDir = 'cooltranslator/js/thefreedictionary/';
    return {
        id: "tfd",
        name: "TheFreeDictionary.com",
        sourceLanguages: ['ru', 'en'],
        targetLanguages: ['ru', 'en'],
        priority: 7,
        domain:"http://www.thefreedictionary.com/",
        path:{
            templatesDir:rootDir
        },
        ajax: {
            translate: "http://www.thefreedictionary.com/{word}"
        },
        contentTypes: [ContentTypes.THESAURUS,ContentTypes.DEFINITIONS,ContentTypes.VERBTABLE]
    };
};

function pron_key(t){
    var pkw=open('http://www.thefreedictionary.com/_/pk'+(t==1?'_ipa':'')+'.htm'+(info.IsApp?'?h=1':''),'pk','width='+(t==1?'800':'630')+',height='+(t==1?'865':'710')+',statusbar=0,menubar=0');
    if(window.focus)pkw.focus();
    return false;
}

function SelectVT(sel){
    var v=sel.options[sel.selectedIndex].value;
    if(v=="0")return;
    var i=1,tbl;
    while((tbl=document.getElementById("VerbTableN"+v.split("_")[0]+"_"+i))!=undefined){
        tbl.className="prettytable hiddenStructure";
        i++;
    }
    document.getElementById("VerbTableN"+v).className="prettytable";
}