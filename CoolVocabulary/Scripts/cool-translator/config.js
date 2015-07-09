// ==UserScript==
// @name CoolTranslatorConfig
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

var CoolTranslatorConfig = function (isContent,oncomplete) {
    this.extensionsRepositoryPage = 'https://github.com/wsbaser/CoolTranslator';
    if (isContent) {
        var self = this;
        kango.invokeAsync('kango.io.getExtensionFileUrl', '', function (root) {
            self.path = {
                root: root,
                images: root + 'cooltranslator/images',
                resources: root
            };
            if (oncomplete)
                oncomplete();
        });
    }
    else {
        var root = kango.io.getExtensionFileUrl('');
        this.path = {
            root: root,
            images: root + 'images'
        };
    }
};