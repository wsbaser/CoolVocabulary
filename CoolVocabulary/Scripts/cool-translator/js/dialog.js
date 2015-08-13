/***** TranslationDialogFactory **********************************************************************************************/
var TranslationDialogFactory =   (function(){
  return {
    initConnection: function(){
      var connection = new ServicesConnection("services_connection");
      connection.open();
      return connection;
    },
    initVocabulary: function(connection){
      return new Vocabulary(LLConfig(), connection);
    },
    initSources: function(connection, vocabulary){
      var arr = 
        [this.createLLSource(connection, vocabulary),
        this.createAbbySource(connection, vocabulary),
        this.createGoogleSource(connection, vocabulary),
        this.createTfdSource(connection)];
      arr.sort(function (a, b) {
          return a.config.priority > b.config.priority ? -1 : 1;
      });
      var allSources = {};
      $(arr).each(function(i, source) {
        source.init();
        allSources[source.config.id] = source;
      });
      return allSources;
    },
    createAbbySource: function(connection, vocabulary){
      var tabs = [];
      tabs.push(new SourceTab(ContentTypes.TRANSLATIONS, { 
        translationItemSelector: '.l-article__showExamp',
        vocabulary: vocabulary 
      }));
      tabs.push(new SourceTab(ContentTypes.EXAMPLES));
      tabs.push(new SourceTab(ContentTypes.PHRASES));
      var service = new DictionaryServiceProxy(AbbyConfig(),connection);
      return new Source(service, tabs);
    },
    createGoogleSource: function(connection, vocabulary){
      var tabs = [];
      tabs.push(new SourceTab(ContentTypes.TRANSLATIONS, {
        translationItemSelector:'.gt-baf-word-clickable',
        vocabulary: vocabulary
      }));
      tabs.push(new SourceTab(ContentTypes.DEFINITIONS));
      tabs.push(new SourceTab(ContentTypes.EXAMPLES));  
      var service = new DictionaryServiceProxy(GoogleConfig(), connection);
      return new Source(service, tabs);
    },
    createTfdSource: function(connection){
      var tabs = [];
      tabs.push(new SourceTab(ContentTypes.THESAURUS));
      tabs.push(new SourceTab(ContentTypes.DEFINITIONS));
      tabs.push(new SourceTab(ContentTypes.VERBTABLE));  
      var service = new DictionaryServiceProxy(TfdConfig(), connection);
      return new Source(service, tabs);
    },
    createLLSource: function(connection, vocabulary){
      var tabs = [];
      tabs.push(new SourceTab(ContentTypes.TRANSLATIONS,
      {
        translationItemSelector: '.ll-translation-item',
        translationWordSelector: '.ll-translation-text',
        vocabulary: vocabulary
      }));
      var service = new DictionaryServiceProxy(LLConfig(), connection);
      return new Source(service, tabs);
    },
    create: function(){
      var connection = this.initConnection();
      var vocabulary = this.initVocabulary(connection);
      var sources = this.initSources(connection, vocabulary);
      return new TranslationDialog(sources, vocabulary);
    }
  };
})();

/***** TranslationDialog *****************************************************************************************************/

function TranslationDialog(allSources, vocabulary){
    this.allSources = allSources;
    this.vocabulary = vocabulary;
    this.sourceLangSelector=null;
    this.targetLangSelector=null;
    this.langSwitcher = null;
    this.allSupportedLangs = this.getAllSupportedLangs(allSources);

    this.el = null;
    this.headerEl = null;
    this.navigationEl = null;
    this.sourceContentEl = null;
    this.notificationEl = null;

    this.sources = null;
    this.activeSource = null;
    this.sourceWithActiveLink = null;
    this.lastRequestData = null;
    this.loginForm = null;
    this.selectionBackup = null;
    this.firstShow = true;
    this.isActive = false;

    this.init();
};

TranslationDialog.ACTIVE_CLASS = 'ctr-active';

TranslationDialog.TEMPLATE = 
'<div id="ctr_dialog">\
    <div id="ctr_header">\
        <div id="ctr_header_bg"></div>\
        <div class="ctr_header_buttons" style="display:none !important">\
          <span id="ctr_info">Press F1 to see hot keys</span>\
          <span id="ctr_settings_icon"/>\
          <span id="ctr_closeBtn" title="Close (Esc)">Esc</span>\
        </div>\
        <form id="ctr_wordInputForm">\
            <div id="sourceLangSelector"></div>\
            <input type="text" id="ctr_wordInput" maxlength="255" value="" placeholder="Type word for translation" class="ctr-input">\
            <div id="targetLangSelector"></div>\
        </form>\
        <div id="ctr_sources"></div>\
        <div class="ctr_hSplitter"></div>\
    </div>\
    <div style="position:relative !important;">\
        <div id="ctr_login_wrap" style="display:none !important;">\
            <form class="ctr-login-form cf">\
                <ul>\
                    <li style="padding-right: 10px !important;"><label for="usermail">Email</label>\
                    <input type="email" required="" name="usermail"></li>\
                    <li><label for="password">Password</label>\
                    <input type="password" required="" name="password"></li>\
                    <li style="width:100% !important;height:25px !important;overflow:hidden !important;">\
                        <div class="ctr-error"></div>\
                        <div class="ctr-spinner">\
                          <div></div>\
                          <div></div>\
                          <div></div>\
                          <div></div>\
                        </div>\
                    </li>\
                    <li style="text-align:center !important; width:100% !important;">\
                    <input type="submit" value="Login"></li>\
                </ul>\
            </form>\
        </div>\
        <div id="ctr_source_content"></div>\
    </div>\
    <div id="ctr_notification">\
        <div class="ctr-ntfTitle"></div>\
        <div class="ctr-ntfBody"></div>\
    </div>\
</div>';


TranslationDialog.prototype.addEventListener = function(eventName, callback){
  this.el.on(eventName, callback);
};

TranslationDialog.prototype.getAllSupportedLangs = function(allSources){
    var langs = [];
    $.each(allSources, function(i, source) {
        $.each(source.config.sourceLanguages.concat(source.config.targetLanguages), function (i, lang) {
            if (langs.indexOf(lang)===-1)
                langs.push(lang);
        });
    });
    return langs;
};

TranslationDialog.prototype.selectNeighbourSource = function(right) {
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
    $.each(this.headerEl.find('.ctr-source-link'),
        function (i, itemEl) {
          itemEl === source.linkEl[0] ?
              source.linkEl.addClass(TranslationDialog.ACTIVE_CLASS) :
              $(itemEl).removeClass(TranslationDialog.ACTIVE_CLASS);
        });
   this.sourceWithActiveLink = source;
};

TranslationDialog.prototype.selectSource = function(source) {
    // . deactivate old source link
   this.activateSourceLink(source);
    // . show new source content
   this.showSourceContent(source);
  // . activate new source link
   this.activeSource = source;
};

TranslationDialog.prototype.showSourceContent = function(source) {
    if(this.activeSource)
      this.activeSource.hide();
    source.show();
};


TranslationDialog.prototype.selectNextSource = function() {
   this.selectNeighbourSource(true);
};

TranslationDialog.prototype.selectPrevSource = function() {
   this.selectNeighbourSource(false);
};

/*
* @param force - update even if data has not changed
* */
TranslationDialog.prototype.updateSourcesContent = function(force) {
  if(!this.isActive)
    return;
  // . do not update content if data not changed and current tab is loading
  var inputData = this.getInputData();
  if (!inputData.word)
    return;
  if (isInputDataEqual(inputData,this.lastRequestData) && !force)
      return;
 this.hideLoginForm();
 this.lastRequestData = inputData;
  // . load data for all sources simultaneously
  $.each(this.sources, function (key, source) {
      source.loadAndShow(inputData);
  });
  // . but show only active
  this.blurInput();
};

TranslationDialog.prototype.getLangPair = function(){
  return {
    sourceLang: this.sourceLangSelector.getSelectedLang(),
    targetLang: this.targetLangSelector.getSelectedLang()
  }
};

// Show only sources which support selected languages pair
TranslationDialog.prototype.updateSourcesList = function() {
  var self = this;
  var lp = this.getLangPair();
  // . filter sources for current language pair
  this.sources = [];
  $.each(this.allSources, function(id, source) {
    if(source.supportsLanguagePair(lp))
      self.sources.push(source);
  });
  // . generate source links
  this.sourceLinksEl.empty();
  $(this.sources).each(function (i, source) {
      source.linkEl = $('<a/>', {
        id: source.linkId(),
        'class': 'ctr-source-link',
        'title': source.config.name,
        html: '<span class="ctr-source-icon"/>'
      });
      source.linkEl.data('sourceId', source.config.id);
      self.sourceLinksEl.append(source.linkEl);
      source.linkEl.on('click', self.onSelectSource.bind(self));
  });
  if(!this.sourceWithActiveLink || !this.sourceWithActiveLink.supportsLanguagePair(lp))
    this.activateSourceLink(this.sources[0]);
};

TranslationDialog.prototype.onSelectSource = function(e) {
    var linkEl = e.target.closest('a');
    var targetSourceId = $.data(linkEl,'sourceId');
    if (targetSourceId === this.activeSource.config.id)
        return; // source is already displayed
   this.selectSource(this.allSources[targetSourceId])
};

TranslationDialog.prototype.appendSourcesContent = function() {
  $.each(this.allSources, function(id, source){
    source.hide();
    this.sourceContentEl.append(source.rootEl);
  }.bind(this));
};

// Create and Show dialog
TranslationDialog.prototype.create = function () {
  this.el = $('#ctr_dialog');
  if(this.el.length)
    this.el.remove();
  // . create element from HTML and add to DOM
  $('body').append(TranslationDialog.TEMPLATE);
  // . retrieve links to DOM elements
  this.el = $('#ctr_dialog');
  this.sourceLinksEl = $('#ctr_sources');
  this.sourceContentEl = $('#ctr_source_content');
  this.headerEl = $('#ctr_header');
  this.notificationPopup = new NotificationPopup('#ctr_notification');
  this.loginForm = new LoginForm('#ctr_login_wrap');
  this.inputFormEl = $('#ctr_wordInputForm');
  $('#ctr_closeBtn').bind('click', this.hide);
  this.inputFormEl.bind('submit', this.submitInputData.bind(this));
  //$('#ctr_settings_icon').bind('click', this.openSettings);
  $('#ctr_header_bg').show(); 
  $('#ctr_header_buttons').show();

  this.initLangSelectors();
  this.appendSourcesContent();
  this.updateSourcesList();
  this.selectSource(this.sourceWithActiveLink);
  $(window).on('resize', this.hide.bind(this));
  document.addEventListener('mousedown', this.mousedown.bind(this));
};

TranslationDialog.prototype.mousedown = function(e){
  if(!this.isActive ||
    $.contains(Dialog.el[0], e.target) ||
    (!this.isExtension && $.contains(this.attachBlockEl[0], e.target)))
    return;
  this.hide();
  return false;
};

TranslationDialog.prototype.showForExtension = function(word) {
  this.el[0].removeAttribute('style');
  this.inputEl = $('#ctr_wordInput');
  this.el.removeClass('ctr-site');
  this.el.addClass('ctr-extension');
  this.inputFormEl.showImportant();
  this.isExtension = true;
  this.selectionBackup = selectionHelper.saveSelection();
  this.show(word);
};

TranslationDialog.prototype.showForSite = function(langPair, attachBlockSelector, word) {
  this.setLangPair(langPair);
  this.attachBlockEl = $(attachBlockSelector);
  this.inputEl = this.attachBlockEl.find('input');
  this.attach();
  this.el.removeClass('ctr-extension');
  this.el.addClass('ctr-site');
  this.inputFormEl.hideImportant();
  this.isExtension = false;
  this.show(word);
};

TranslationDialog.prototype.show = function(word) {
  if(!this.isActive){
    this.el.removeClass('ctr-hide');
    this.el.addClass('ctr-show');
    this.isActive = true;
  }
  if(word)
    this.inputEl.val(word);
  else
    this.focusInput();
  this.updateSourcesContent();
};

TranslationDialog.prototype.hide = function() {
  if(this.isActive) {
    this.el.removeClass('ctr-show');
    this.el.addClass('ctr-hide');
    if(this.selectionBackup){
      selectionHelper.restoreSelection(this.selectionBackup);
      this.selectionBackup = null;
    }
    this.inputEl.val('');
    // . clean up content
    this.lastRequestData = null;
    $.each(this.allSources, function (id, source) {
        source.clear();
    });
    this.isActive = false;
    return true;
  }
  return false;
};

TranslationDialog.prototype.setLangPair = function(langPair){
  this.langPair = langPair;
  this.sourceLangSelector.setSelectedLang(this.langPair.sourceLang, null, true);
  this.targetLangSelector.setSelectedLang(this.langPair.targetLang);
};

TranslationDialog.prototype.initLangSelectors = function(){
  // .initialize Lang Selectors
  var self = this;
  var options = {
      onLangChange: self.updateSourcesList.bind(self),
      onLangAccepted: function(){
         self.selectSource(self.sourceWithActiveLink);
         self.updateSourcesContent();
         var langPair = self.getLangPair();
         console.log('sourceLang: ' + langPair.sourceLang + ', targetLang: ' + langPair.targetLang);
         self.el.trigger('langPairChanged', langPair);
      },
      onLoseFocus: self.focusInput.bind(self)
  };
  this.sourceLangSelector = new LangSelector('#sourceLangSelector', this.allSupportedLangs, options);
  this.targetLangSelector = new LangSelector('#targetLangSelector', this.allSupportedLangs, options);
  this.langSwitcher = new LangSwitcher(this.sourceLangSelector, this.targetLangSelector);
};

TranslationDialog.prototype.init = function() {
  // called once 
  this.create();
};

TranslationDialog.prototype.getInputData = function() {
  var lp = this.getLangPair();
  return {
      word: strHelper.trimText(this.inputEl.val()),
      sourceLang: lp.sourceLang,
      targetLang: lp.targetLang
  };
};

TranslationDialog.prototype.attach = function() {
  var l,t;
  // .attach to element bottom
  var GAP = 2;
  var rect = this.attachBlockEl[0].getBoundingClientRect();
  t = rect.top + this.attachBlockEl[0].offsetHeight + GAP;
  l = rect.left;
  this.el[0].style.setProperty('width', this.attachBlockEl[0].offsetWidth+'px','important');
  this.el[0].style.setProperty('left', l + 'px', 'important');
  this.el[0].style.setProperty('top', t + 'px', 'important');
};

TranslationDialog.prototype.showError = function(bodyHtml){
  this.notificationPopup.showError(bodyHtml);
};

TranslationDialog.prototype.showNotification = function(title, bodyHtml) {
  this.notificationPopup.show(title, bodyHtml);
};

/****** EXTENSION ONLY *******************************************************************************************************/

TranslationDialog.prototype.showLoginForm = function(service,loginCallback) {
  this.loginForm.show(service, loginCallback);
};

TranslationDialog.prototype.hideLoginForm = function() {
  this.loginForm.hide();
};

TranslationDialog.prototype.isInputFocused = function(){
  return document.activeElement===Dialog.inputEl[0];
}

TranslationDialog.prototype.focusInput=function() {
   this.inputEl.select();
   this.inputEl.focus();
};

TranslationDialog.prototype.blurInput=function() {
   this.inputEl.blur();
};

TranslationDialog.prototype.submitInputData = function () {
    this.updateSourcesContent(true);
    return false;
};