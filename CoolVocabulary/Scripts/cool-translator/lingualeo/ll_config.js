/**
 * Created by wsbaser on 05.03.2015.
 */
// ==UserScript==
// @name LinguaLeoConfig
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==
var LLConfig = function() {
    var cdnHost = 'https://d144fqpiyasmrr.cloudfront.net',
        apiHost = 'https://api.lingualeo.com',
        siteHost = 'https://lingualeo.com';
    var rootDir = 'cooltranslator/js/lingualeo/';
    return {
        id: "lleo",
        name: "LinguaLeo",
        sourceLanguages: ['en'],
        targetLanguages: ['ru'],
        priority: 10,
        api: apiHost,
        serverPort: 1002,
        ajax: {
            isAuthenticated: '/isauthorized',
            getTranslations: '/gettranslates',
            addWordToDict: '/addword',
            login: siteHost + '/api/login'
        },
        domain: 'http://lingualeo.com',
        path: {
            wordArticle: '/userdict#/{originalText}',
            audio_player: cdnHost + '/plugins/all/flash/1.html#sound=',
            templatesDir:rootDir
        },
        maxTextLengthToTranslate: 50
    };
};