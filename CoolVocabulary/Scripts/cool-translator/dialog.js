/***** Dialog *********************************************************************************************************/

function TranslationDialog(allSources, isExtension, options){
    this.allSources = allSources;
    this.isExtension = isExtension;
    this.options = options;
    if(this.isExtension){
      this.sourceLangSelector=null;
      this.targetLangSelector=null;
      this.langSwitcher = null;
    }
    else{
      this.attachBlockEl = $(options.attachBlockSelector);
      if(!this.attachBlockEl)
        throw new Error('Attach element not found');
      if(!options.langPair)
        throw new Error('Lang pair is not specified');
    }
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
};

TranslationDialog.TEMPLATE = 
'<div id="ctr_dialog" style='display:none;'>
    <div id="ctr_header">
        <div id="ctr_header_bg" style="display:none !important"></div>
        <div class="ctr_header_buttons" style="display:none !important">
          <span id="ctr_info">Press F1 to see hot keys</span>
          <img id="ctr_settings_icon" src="http://icons.iconarchive.com/icons/grafikartes/flat-retro-modern/16/settings-icon.png"/>
          <span id="ctr_closeBtn" title="{closeBtnHint}">Esc</span>
        </div>
        <form id="ctr_wordInputForm" style="display:none !important">
            <div id="sourceLangSelector"></div>
            <input type="text" id="ctr_wordInput" maxlength="255" value="" placeholder="{wordInputHint}" class="ctr-input">
            <div id="targetLangSelector"></div>
        </form>
        <div id="ctr_sources"></div>
        <div class="ctr_hSplitter"></div>
    </div>
    <div style="position:relative !important;">
        <div id="ctr_login_wrap" style="display:none !important;">
            <form class="ctr-login-form cf">
                <ul>
                    <li style="padding-right: 10px !important;"><label for="usermail">Email</label>
                    <input type="email" required="" name="usermail"></li>
                    <li><label for="password">Password</label>
                    <input type="password" required="" name="password"></li>
                    <li style="width:100% !important;height:25px !important;overflow:hidden !important;">
                        <div class="ctr-error"></div>
                        <div class="ctr-spinner">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                    </li>
                    <li style="text-align:center !important; width:100% !important;">
                    <input type="submit" value="Login"></li>
                </ul>
            </form>
        </div>
        <div id="ctr_source_content"></div>
    </div>
    <div id="ctr_notification">
        <div class="ctr-ntfTitle"></div>
        <div class="ctr-ntfBody"></div>
    </div>
</div>';

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

/*
* @param force - update even if data has not changed
* */
TranslationDialog.prototype.updateSourcesContent = function(force) {
    // . do not update content if data not changed and current tab is loading
    var inputData = this.getInputData();
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

TranslationDialog.prototype.showSourceContent = function(source) {
    // . clean up dialog
   this.sourceContentEl.empty();
    // . append source elements in dialog
   this.sourceContentEl.appendChild(source.rootEl);
    source.adjustArticleHeight();
};

TranslationDialog.prototype.getLangPair = function(){
  if(this.isExtension){
    return {
      sourceLang:this.sourceLangSelector.getSelectedLang(),
      targetLang:this.targetLangSelector.getSelectedLang()
    }
  }
  else
    return this.options.langPair;
};

// Show only sources which support selected languages pair
TranslationDialog.prototype.updateSourcesList = function() {
    var lp = this.getLangPair();
    // . filter sources for current language pair
    this.sources = $.makeArray(this.allSources).grep(function (source) {
        return source.supportsLanguagePair(lp);
    }).toArray();
    this.sourceWithActiveLink = this.activeSource = this.sources[0];
    // . generate source links
    var self = this;
    $(this.sources).each(function (i, source) {
        source.linkEl = $('<a/>',{
          'class': self.activeSource.config.id === source.config.id ?Classes.ACTIVE : ''
          'title': source.config.name,
          html:'<span class="ctr-source-icon"/>'
        });
        $.data(source.linkEl,'sourceId',id);
        this.sourceLinksEl.append(source.linkEl);
        source.linkEl.bind('click', self.onSelectSource.bind(self));
    });
};

TranslationDialog.prototype.onSelectSource = function(e) {
    var linkEl = e.target.closest('a');
    var targetSourceId = $.data(linkEl, 'sourceId');
    if (targetSourceId === this.activeSource.config.id)
        return; // source is already displayed
   this.selectSource(this.allSources[targetSourceId])
};

TranslationDialog.prototype.adjustArticleHeight = function(){
   this.activeSource.adjustArticleHeight();
};

TranslationDialog.isInputDataEqual = function(data1, data2) {
    data1 = data1 || {};
    data2 = data2 || {};
    return data1.word == data2.word &&
        data1.sourceLang == data2.sourceLang &&
        data1.targetLang == data2.targetLang;
};

// Create and Show dialog
TranslationDialog.prototype.create = function (callback) {
  // . generate dialog html from template
  var html = strHelper.format(TranslationDialog.TEMPLATE, {
      imagesUrl: this.options.imagesUrl,
      closeBtnHint: 'Close (Esc)',
      wordInputHint: 'Type word for translation'
  });
  // . create element from HTML and add to DOM
  $('body').append(html);
  // . retrieve links to DOM elements
  this.el = $('#ctr_dialog');
  this.sourceLinksEl = $('#ctr_sources');
  this.sourceContentEl = $('#ctr_source_content');
  this.headerEl = $('#ctr_header');
  this.notificationPopup = new NotificationPopup('#ctr_notification');
  this.loginForm = new LoginForm('#ctr_login_wrap');


  if(this.isExtension){
    this.inputEl = $('#ctr_wordInput');
    this.initLangSelectors();
    $('#ctr_closeBtn').bind('click', this.hide);
    $('#ctr_wordInputForm').bind('submit',this.submitInputData);
    $('#ctr_settings_icon').bind('click', ctrContent.openSettings);
    $('#ctr_header_bg').show(); 
    $('#ctr_header_buttons').show(); 
    $('#ctr_wordInputForm').show(); 
  }

  // . update source links
  this.updateSourcesList();
  // . bind events
  $(this.el).bind('mousedown', stopPropagation)
      .bind('mouseup', stopPropagation)
      .bind('contextmenu', stopPropagation);
  $(document.documentElement).bind('resize',this.adjustArticleHeight);
};

TranslationDialog.prototype.show = function(word) {
    this.updatePosition();
    this.el.addClass(Classes.SHOW);
    if (word){
        if(isExtension)
          this.inputEl.value = word;
        else
          this.inputWord = word;
    }
    else
        this.focusInput();
    this.isActive = true;
};

TranslationDialog.prototype.hide= function() {
    if(this.isActive) {
      this.el.removeClass(Classes.SHOW);
      this.sourceContentEl.empty();
      if(this.isExtension)
        this.inputEl.value='';
      this.lastRequestData = null;
      $.each(this.allSources, function (id, source) {
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

TranslationDialog.prototype.getInputData = function() {
  var inputWord = this.isExtension?
    strHelper.trimText(this.inputEl.value):
    this.inputWord;
  var lp = this.getLangPair();
  return {
      word: inputWord,
      sourceLang: lp.sourceLang,
      targetLang: lp.targetLang
  };
};

TranslationDialog.prototype.updatePosition = function () {
  var l,t;
  if(this.isExtension){
    // .center dialog in viewport
    var body = $('body')[0];
    t = 0;
    console.log('dialogwidth: ' + this.el.offsetWidth);
    l = (body.offsetWidth -this.el.offsetWidth) / 2;
  }
  else {
    // .attach to element bottom
    var rect = this.attachBlockEl[0].getBoundingClientRect();
    t = rect.top + this.attachBlockEl[0].offsetHeight;
    l = rect.left;
  }
  this.el.style.setProperty('left', l + 'px', 'important');
  this.el.style.setProperty('top', t + 'px', 'important');
};

TranslationDialog.prototype.showError = function(bodyHtml){
    this.notificationPopup.showError(bodyHtml);
};

TranslationDialog.prototype.showNotification = function(title, bodyHtml) {
    this.notificationPopup.show(title, bodyHtml);
};

/****** EXTENSION ONLY *******************************************************************************************************/

TranslationDialog.prototype.showLoginForm = function(source,loginCallback) {
    this.loginForm.show(source, loginCallback);
};

TranslationDialog.prototype.hideLoginForm = function() {
    this.loginForm.hide();
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

TranslationDialog.prototype.submitInputData = function () {
    this.updateSourcesContent(true);
    return false;
};

var Dialog = new TranslationDialog();