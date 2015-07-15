/***** Dialog *********************************************************************************************************/

function TranslationDialog(dialogElementId){
    this.el = dialogElementId?$('#'+dialogElementId): null;
    this.headerEl = null;
    this.navigationEl = null;
    this.sourceContentEl = null;
    this.notificationEl = null;
    this.sources = null;
    this.activeSource = null;
    this.sourceWithActiveLink = null;
    this.lastRequestData = null;
    this.sourceLangSelector=null;
    this.targetLangSelector=null;
    this.langSwitcher = null;
    this.loginForm = null;
    this.selectionBackup = null;
    this.firstShow = true;
    this.isActive = false;
}

TranslationDialog.SOURCE_LINK_TMPL =
    '<a id="{sourceLinkId}" class="ctr-source-link {sourceLinkClass}"  title="{name}">' +
    '<span class="ctr-source-icon"/>' +
    '</a>';

TranslationDialog.isInputDataEqual = function(data1, data2) {
    data1 = data1 || {};
    data2 = data2 || {};
    return data1.word == data2.word &&
        data1.sourceLang == data2.sourceLang &&
        data1.targetLang == data2.targetLang;
};

TranslationDialog.prototype.showLoginForm = function(source,loginCallback) {
    this.loginForm.show(source, loginCallback);
};

TranslationDialog.prototype.hideLoginForm = function() {
    this.loginForm.hide();
};

TranslationDialog.prototype.showError = function(bodyHtml){
    this.notificationPopup.showError(bodyHtml);
};

TranslationDialog.prototype.showNotification = function(title, bodyHtml) {
    this.notificationPopup.show(title, bodyHtml);
};

TranslationDialog.prototype.selectNeighbourSource=function(right) {
    if (!this.activeSource)
        return; // no sources to select
    var index = this.sources.indexOf(this.sourceWithActiveLink);
    index = right ?
    (index + 1) % this.sources.length :
    (index || this.sources.length ) - 1;

    // . activate new source link
    this.activateSourceLink(this.sources[index]);
};

TranslationDialog.prototype.activateSourceLink = function(source) {
    $.each(this.headerEl.getElementsByClassName('ctr-source-link'),
        function (i, itemEl) {
            itemEl === source.linkEl ?
                source.linkEl.addClass(Classes.ACTIVE) :
                itemEl.removeClass(Classes.ACTIVE );
        });
   this.sourceWithActiveLink = source;
};

TranslationDialog.prototype.selectSource = function(source) {
    // . deactivate old source link
   this.activateSourceLink(source);
    // . activate new source link
   this.activeSource = source;
    // . show new source content
   this.showSourceContent(this.activeSource);
};

TranslationDialog.prototype.selectNextSource = function() {
   this.selectNeighbourSource(true);
};

TranslationDialog.prototype.selectPrevSource = function() {
   this.selectNeighbourSource(false);
};

TranslationDialog.prototype.isInputFocuces = function(){
    return document.activeElement===Dialog.inputEl;
}

TranslationDialog.prototype.focusInput=function() {
   this.inputEl.select();
   this.inputEl.focus();
};

TranslationDialog.prototype.blurInput=function() {
   this.inputEl.blur();
};

/*
* @param force - update even if data has not changed
* */
TranslationDialog.prototype.updateSourcesContent = function(force) {
    // . do not update content if data not changed and current tab is loading
    var inputData =this.getInputData();
    if (!inputData.word)
        return;
    if (TranslationDialog.isInputDataEqual(inputData,this.lastRequestData) && !force)
        return;
   this.hideLoginForm();
   this.lastRequestData = inputData;
    // . load data for all sources simultaneously
    dictionaryHelper.each(ctrContent.sources, function (key, source) {
        source.loadAndShow(inputData);
    });
    // . but show only active
   this.showSourceContent(this.activeSource);
   this.blurInput();
};

TranslationDialog.prototype.getInputData = function() {
    var inputWord = strHelper.trimText(this.inputEl.value);
    var sourceLang =this.sourceLangSelector.getSelectedLang();
    var targetLang =this.targetLangSelector.getSelectedLang()
    return {
        word: inputWord,
        sourceLang: sourceLang,
        targetLang: targetLang
    };
};

TranslationDialog.prototype.showSourceContent = function(source) {
    // . clean up dialog
   this.sourceContentEl.empty();
    // . append source elements in dialog
   this.sourceContentEl.appendChild(source.rootEl);
    source.adjustArticleHeight();
};

// Center dialog in viewport
TranslationDialog.prototype.updatePosition = function () {
    var body = document.getElementsByTagName('body')[0];
    var t = 0;
    console.log('dialogwidth: ' +this.el.offsetWidth);
    var l = (body.offsetWidth -this.el.offsetWidth) / 2;
   this.el.style.setProperty('left', l + 'px', 'important');
   this.el.style.setProperty('top', t + 'px', 'important');
};

// Show only sources which support selected languages pair
TranslationDialog.prototype.updateSourcesList = function() {
    // . generate source links HTML from a Template
    var sourceLang =this.sourceLangSelector.getSelectedLang();
    var targetLang =this.targetLangSelector.getSelectedLang();
   this.sources = $(ctrContent.sources).grep(function (i, source) {
        return source.supportsLanguagePair(sourceLang, targetLang);
    }).toArray();
   this.sourceWithActiveLink = this.activeSource = this.sources[0];
    var HTML = $(this.sources).map(function (source) {
        var linkHTML = strHelper.format(TranslationDialog.SOURCE_LINK_TMPL, {'sourceLinkId': source.linkId()});
        linkHTML = strHelper.format(linkHTML,
            {sourceLinkClass:this.activeSource.config.id === source.config.id ?Classes.ACTIVE : ''});
        return strHelper.format(linkHTML, {name: source.config.name});
    }).toArray().join('');
    // . create elements from HTML and add to DOM
   this.sourceLinksEl.innerHTML=HTML;
    // . bind events
    $(this.sources).each(function (id, source) {
        source.linkEl = $('#' + source.linkId());
        source.linkEl.bind('click',this.selectSource);
    });
};

// Create and Show dialog
TranslationDialog.prototype.create = function (callback) {
    templatesHelper.getTemplate('dialog', function (htmlTemplate) {
        // . generate dialog html from template
        var html = strHelper.format(htmlTemplate, {
            imagesUrl: ctrContent.config.path.images,
            closeBtnHint: 'Close (Esc)',
            wordInputHint: 'Type word for translation'
        });
        // . create element from HTML and add to DOM
        $('body').append(html);
        // . retrieve links to DOM elements
       this.el = document.getElementById('ctr_dialog');
       this.headerEl = document.getElementById('ctr_header');
       this.inputEl = document.getElementById('ctr_wordInput');
       this.sourceLinksEl = document.getElementById('ctr_sources');
       this.sourceContentEl = document.getElementById('ctr_source_content');

       this.loginForm = new LoginForm('ctr_login_wrap');
       this.notificationPopup = new NotificationPopup('ctr_notification');
        // . init lang selectors
       this.initLangSelectors();
        // . update source links
       this.updateSourcesList();
        // . bind events
        $(this.el).bind('mousedown', stopPropagation)
            .bind('mouseup', stopPropagation)
            .bind('contextmenu', stopPropagation);
        $('#ctr_closeBtn').bind('click', this.hide);
        $('#ctr_wordInputForm').bind('submit',this.submitInputData);
        $('#ctr_settings_icon').bind('click', ctrContent.openSettings);
        $(document.documentElement).bind('resize',this.adjustArticleHeight);
        callback();
    });
};

TranslationDialog.prototype.show = function(word) {
    this.updatePosition();
    this.el.addClass(Classes.SHOW);
    if (word)
        this.inputEl.value = word;
    else
        this.focusInput();
    this.isActive = true;
};

TranslationDialog.prototype.hide= function() {
    if(this.isActive) {
       this.el.removeClass(Classes.SHOW);
       this.sourceContentEl.empty();
       this.inputEl.value='';
       this.lastRequestData = null;
        dictionaryHelper.each(ctrContent.sources, function (id, source) {
            source.clear();
        });
        selectionHelper.restoreSelection(this.selectionBackup);
       this.isActive = false;
        return true;
    }
    return false;
};

TranslationDialog.prototype.updateLangPair = function() {
    var langPair =this.sourceLangSelector.getSelectedLang() +
        '-' +
       this.targetLangSelector.getSelectedLang();
    kango.invokeAsync('kango.storage.setItem', 'langPair', langPair);
};

TranslationDialog.prototype.getLangPair = function() {
    kango.invokeAsync('kango.storage.getItem', 'langPair', function (langPair) {
        var sourceLang, targetLang;
        if (langPair) {
            var arr = langPair.split('-');
            sourceLang = arr[0];
            targetLang = arr[1];
        }
        else {
            sourceLang = 'en';
            targetLang = ctrContent.currentLocale;
        }
       this.sourceLangSelector.setSelectedLang(sourceLang);
       this.targetLangSelector.setSelectedLang(targetLang);
    });
};

TranslationDialog.prototype.initLangSelectors = function(){
    // .initialize Lang Selectors
    var options = {
        onLangChange:this.updateSourcesList,
        onLangAccepted:function(){
           this.updateSourcesContent();
           this.updateLangPair();
        },
        onLoseFocus:this.focusInput
    };
   this.sourceLangSelector = new LangSelector('sourceLangSelector', ctrContent.allSupportedLangs, options);
   this.targetLangSelector = new LangSelector('targetLangSelector', ctrContent.allSupportedLangs, options);
   this.langSwitcher = new LangSwitcher(this.sourceLangSelector,this.targetLangSelector);
};

TranslationDialog.prototype.init = function() {
   this.create(function () {
       this.getLangPair();
    });
};

/*****TranslationDialog.handlers ************************************************************************************************/

TranslationDialog.prototype.adjustArticleHeight = function(){
   this.activeSource.adjustArticleHeight();
};

TranslationDialog.prototype.selectSource = function() {
    var targetSourceId = $(this.id.split('_')).last()[0];
    if (targetSourceId ==this.activeSource.config.id)
        return; // source is already displayed
   this.selectSource(ctrContent.sources[targetSourceId])
};

TranslationDialog.prototype.submitInputData = function () {
    this.updateSourcesContent(true);
    return false;
};

var Dialog = new TranslationDialog();