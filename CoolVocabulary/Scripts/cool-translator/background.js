var cooltranslator = {};
cooltranslator.tmplElems = {};
cooltranslator.sources = {};

cooltranslator.getTemplate = function(id, dir) {
    if (!(id in cooltranslator.tmplElems)) {
        dir = dir || 'cooltranslator/templates/';
        cooltranslator.tmplElems[id] = kango.io.getExtensionFileContents(dir + id + '.tmpl');
    }
    return {html: cooltranslator.tmplElems[id]};
};

cooltranslator.checkExtensionVersion = function () {
    var ver = kango.getExtensionInfo().version;
    if (kango.storage.getItem('version') != ver) {
        //window.setTimeout(function () {
        //    kango.browser.tabs.create({url: cooltranslator.config.extensionsRepositoryPage});
        //}, 500);
        kango.storage.setItem('version', ver);
    }
};

cooltranslator.getCurrentLocale = function () {
    var currentLocale = kango.storage.getItem('currentLocale');
    if (!currentLocale) {
        currentLocale = kango.i18n.getCurrentLocale();
        kango.storage.setItem('currentLocale', currentLocale);
    }
    console.log('current locale: ' + currentLocale);
    return currentLocale;
};

cooltranslator.initSources = function() {
    var all = [abby, lleo, google,tfd];
    for (var i = 0; i < all.length; i++) {
        var source = all[i];
        cooltranslator.sources[source.config.id] = source;
        source.init();
    }
};

cooltranslator.init = function () {
    cooltranslator.config = new CoolTranslatorConfig(false);
    cooltranslator.checkExtensionVersion();
    cooltranslator.initSources();
};

cooltranslator.init();


