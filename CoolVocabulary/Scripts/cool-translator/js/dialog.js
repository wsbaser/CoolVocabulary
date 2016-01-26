/***** ServiceProvider **********************************************************************************************/
var ServiceProvider =   (function(){
  return {
    getConnection: function(){
      if(!this.connection){
        this.connection = new ServicesConnection("services_connection");
        this.connection.open();
      }
      return this.connection;
    },
    getVocabulary: function(connection){
      if(!this.vocabulary){
        this.vocabulary = new Vocabulary(CVConfig(), connection);
      }
      return this.vocabulary;
    },
    getLangDetector: function(connection){
      if(!this.langDetector){
        this.langDetector = new LangDetector(GoogleConfig(), connection);
      }
      return this.langDetector;
    },
    getSources: function(connection, vocabulary){
      if(!this.sources){
        var self = this;
        var arr = 
          [this.createLLSource(connection, vocabulary),
          this.createAbbySource(connection, vocabulary),
          this.createGoogleSource(connection, vocabulary),
          this.createLingueeSource(connection, vocabulary),
          this.createTfdSource(connection),
          this.createMultitranSource(connection, vocabulary)];
        arr.sort(function (a, b) {
            return a.config.priority > b.config.priority ? -1 : 1;
        });
        this.sources = {};
        arr.forEach(function(source){
          source.init();
          self.sources[source.config.id] = source;
        });
      }
      return this.sources;
    },
    createMultitranSource: function(connection, vocabulary){
      var tabs = [];
      var serviceConfig = MultitranConfig();
      tabs.push(new SourceTab(serviceConfig.id,ContentTypes.TRANSLATIONS, { 
        translationItemSelector: '.trans>a',
        vocabulary: vocabulary
      }));
      var service = new DictionaryServiceProxy(serviceConfig,connection);
      return new Source(service, tabs);      
    },
    createAbbySource: function(connection, vocabulary){
      var tabs = [];
      var serviceConfig = AbbyConfig();
      tabs.push(new SourceTab(serviceConfig.id,ContentTypes.TRANSLATIONS, { 
        translationItemSelector: '.l-article__showExamp',
        vocabulary: vocabulary
      }));
      tabs.push(new SourceTab(serviceConfig.id,ContentTypes.EXAMPLES));
      tabs.push(new SourceTab(serviceConfig.id,ContentTypes.PHRASES));
      var service = new DictionaryServiceProxy(serviceConfig,connection);
      return new Source(service, tabs);
    },
    createGoogleSource: function(connection, vocabulary){
      var tabs = [];
      var serviceConfig = GoogleConfig();
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, {
        translationItemSelector:'.gt-baf-word-clickable',
        vocabulary: vocabulary
      }));
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.DEFINITIONS));
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.EXAMPLES));  
      var service = new DictionaryServiceProxy(serviceConfig, connection);
      return new Source(service, tabs);
    },
    createLingueeSource: function(connection, vocabulary){
      var tabs = [];
      var serviceConfig = LingueeConfig();
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS, {
        translationItemSelector:'.tag_trans>.dictLink',
        vocabulary: vocabulary
      }));
      // tabs.push(new SourceTab(serviceConfig.id, ContentTypes.EXAMPLES));  
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.PHRASES));
      var service = new DictionaryServiceProxy(serviceConfig, connection);
      return new Source(service, tabs);
    },
    createTfdSource: function(connection){
      var tabs = [];
      var serviceConfig = TfdConfig();
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.THESAURUS));
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.DEFINITIONS));
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.VERBTABLE));  
      var service = new DictionaryServiceProxy(serviceConfig, connection);
      return new Source(service, tabs);
    },
    createLLSource: function(connection, vocabulary){
      var tabs = [];
      var serviceConfig = LLConfig();
      tabs.push(new SourceTab(serviceConfig.id, ContentTypes.TRANSLATIONS,
      {
        translationItemSelector: '.ll-translation-item',
        translationWordSelector: '.ll-translation-text',
        vocabulary: vocabulary
      }));
      var service = new DictionaryServiceProxy(serviceConfig, connection);
      return new Source(service, tabs);
    },
    getDialog: function(){
      if(!this.dialog){
        var connection = this.getConnection();
        var vocabulary = this.getVocabulary(connection);
        var langDetector = this.getLangDetector(connection);
        var sources = this.getSources(connection, vocabulary);
        this.dialog = new TranslationDialog(sources, vocabulary, langDetector);
      }
      return this.dialog;
    }
  };
})();

/***** TranslationDialog *****************************************************************************************************/

function TranslationDialog(allSources, vocabulary, langDetector){
    this.allSources = allSources;
    this.vocabulary = vocabulary;
    this.langDetector = langDetector;
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

    this.reactor = new Reactor();
    this.reactor.registerEvent(TranslationDialog.LANG_PAIR_CHANGED);
};

TranslationDialog.LANG_PAIR_CHANGED =  'langPairChanged';
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
        <div class="popover-container" style="display:none !important;">\
        </div>\
        <div id="ctr_source_content"></div>\
    </div>\
    <div id="ctr_notification">\
        <div class="ctr-ntfTitle"></div>\
        <div class="ctr-ntfBody"></div>\
    </div>\
</div>';


TranslationDialog.prototype.addEventListener = function(eventName, callback){
  this.reactor.addEventListener(eventName, callback);
};

TranslationDialog.prototype.getAllSupportedLangs = function(allSources){
    var langs = [];
    $.each(allSources, function(i, source) {
      for(var lang in source.config.languages){
        if (langs.indexOf(lang)===-1)
            langs.push(lang);        
      }
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
          source && itemEl === source.linkEl[0] ?
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
    if(source)
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
  var self = this;
  // . do not update content if data not changed and current tab is loading
  var inputData = this.getInputData();
  if (!inputData.word)
    return;
  if (isInputDataEqual(inputData,this.lastRequestData) && !force)
      return;
  this.hideLoginForm();
  this.lastRequestData = inputData;

  if(this.isExtension){
    // . detect language
    this.showLoadingForAll(inputData);
    this.langDetector.detect(inputData.word, function(promise){
      promise.done(function(languages){
        if(languages){
            if(languages.indexOf(inputData.sourceLang)==-1){
              if(languages.indexOf(inputData.targetLang)!=-1){
                self.langSwitcher.switch();
                return;
              }
              else{
                // . show correct languages to user
                self.showCorrectLanguages(languages);
              }
            }
        }
        self.loadAll(inputData);
      }).fail(function(){
        self.loadAll(inputData);
      });
    });
  }
  else{
    self.loadAll(inputData);
  }

  // . but show only active
  this.blurInput();
};

TranslationDialog.prototype.showCorrectLanguages = function(languages){
  // . NOT IMPLEMENTED
};

TranslationDialog.prototype.showLoadingForAll = function(inputData){
  // . load data for all sources simultaneously
  $.each(this.sources, function (key, source) {
      source.loadAndShow(inputData);
  });
}

TranslationDialog.prototype.loadAll = function(inputData){
  // . load data for all sources simultaneously
  $.each(this.sources, function (key, source) {
      source.loadAndShow(inputData);
  });
}

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
  if(this.el){
    return;
  }
  // . create element from HTML and add to DOM
  var ctrRootEl = $('<div id="ctr_root"/>');
  ctrRootEl.append(TranslationDialog.TEMPLATE);
  $('body').append(ctrRootEl);
  // . retrieve links to DOM elements
  this.el = $('#ctr_dialog');
  this.sourceLinksEl = $('#ctr_sources');
  this.sourceContentEl = $('#ctr_source_content');
  this.headerEl = $('#ctr_header');
  this.notificationPopup = new NotificationPopup('#ctr_notification');
  this.loginForm = new LoginForm('.popover-container');
  this.selectBook = new SelectBook('.popover-container');
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
  if(this.langPair){
    this.setLangPair(this.langPair);
  }
  $(window).on('resize', this.hide.bind(this));
  document.addEventListener('mousedown', this.mousedown.bind(this));
};

TranslationDialog.prototype.mousedown = function(e){
  if(!this.isActive ||
    $.contains(Dialog.el[0], e.target) ||
    (!this.isExtension && $.contains(this.attachBlockEl[0], e.target)))
    return;
  this.hide();
  e.preventDefault();
  return false;
};

TranslationDialog.prototype.showForExtension = function(word) {
  this.create();
  this.vocabulary.setBook(0);
  this.el[0].removeAttribute('style');
  this.inputEl = $('#ctr_wordInput');
  this.el.removeClass('ctr-site');
  this.el.addClass('ctr-extension');
  this.inputFormEl.showImportant();
  this.isExtension = true;
  this.selectionBackup = selectionHelper.saveSelection();
  this.vocabulary.checkAuthentication();
  this.show(word);
};

TranslationDialog.prototype.showForSite = function(langPair, attachBlockSelector, word, bookId, user) {
  this.create();
  this.setLangPair(langPair);
  this.attachBlockEl = $(attachBlockSelector);
  this.vocabulary.setBook(bookId, true);
  this.inputEl = this.attachBlockEl.find('input');
  this.attach();
  this.el.removeClass('ctr-extension');
  this.el.addClass('ctr-site');
  this.inputFormEl.hideImportant();
  this.isExtension = false;
  this.vocabulary.authenticate(user);
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
  this.setLangDirection();
  this.updateSourcesContent();
};

TranslationDialog.prototype.hide = function() {
  if(this.isActive) {
    this.hideLoginForm();
    this.hideSelectBook();
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
  if(this.el){
    this.sourceLangSelector.setSelectedLang(this.langPair.sourceLang, null, true);
    this.targetLangSelector.setSelectedLang(this.langPair.targetLang);
  }
};

TranslationDialog.prototype.setLangDirection = function(){
  if(this.inputEl){
    var langPair = this.getLangPair();
    var RTL_LANGUAGES = ['ar'];
    var dir = RTL_LANGUAGES.indexOf(langPair.sourceLang)!==-1?'rtl':'ltr';
    if(RTL_LANGUAGES.indexOf(langPair.sourceLang)!==-1){
      this.inputEl.addClass('rtl');
    }
    else{
      this.inputEl.removeClass('rtl');
    }
  }
};

TranslationDialog.prototype.initLangSelectors = function(){
  // .initialize Lang Selectors
  var self = this;
  var options = {
      onLangChange: self.updateSourcesList.bind(self),
      onLangAccepted: function(){
         self.selectSource(self.sourceWithActiveLink);
         self.updateSourcesContent();
         self.setLangDirection();
         self.reactor.dispatchEvent(TranslationDialog.LANG_PAIR_CHANGED, self.getLangPair());
      },
      onLoseFocus: self.focusInput.bind(self)
  };
  this.sourceLangSelector = new LangSelector('#sourceLangSelector', this.allSupportedLangs, options);
  this.targetLangSelector = new LangSelector('#targetLangSelector', this.allSupportedLangs, options);
  this.langSwitcher = new LangSwitcher(this.sourceLangSelector, this.targetLangSelector);
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

TranslationDialog.prototype.showSelectBook = function(inputData, translation, callback) {
  var self = this;
  if(this.vocabulary.bookRemembered){
    callback();
  }else{
    function canBeUpdated(book){
      return book.userId===book.authorId;
    }
    var books = this.vocabulary.user.books.filter(function(item){
        return item.language===inputData.sourceLang && canBeUpdated(item);
    });
    if(books.length){
      this.selectBook.show(books, inputData.word, translation, function(bookId, remember){
        self.vocabulary.setBook(bookId, remember);
        self.hideSelectBook();
        callback();
      });
    }
    else{
      callback();
    }
  }
};

TranslationDialog.prototype.hideSelectBook = function() {
  this.selectBook.hide();
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