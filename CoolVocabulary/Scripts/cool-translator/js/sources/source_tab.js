function SourceTab(contentType, options) {
    this.contentType = contentType;
    this.options = options ||{};
    this.title = ContentTypes.getTitle(this.contentType);
    this.rootEl = $('<div/>');
    this.rootEl.hide();
    this.contentEl = this.createContentEl();
    this.loadingEl = this.createLoadingEl();
    this.navigationEl = this.createNavigationEl();
    this.hasContent = false;
    this.isLoading = false;
    if(contentType===ContentTypes.TRANSLATIONS){
        if(!options.translationItemSelector)
            throw new Error('Translation item selector not specified.');
        if(!options.vocabulary)
            throw new Error('Vocabulary not specified.');
        this._addTranslation = new AddTranslationControl(options.vocabulary);
        this.rootEl.append(this._addTranslation.el);
    }
}

SourceTab.LOADING_CLASS = 'ctr-tab-loading';
SourceTab.ACTIVE_CLASS = 'ctr-active';
SourceTab.SELECTED_CLASS= 'ctr-selected';
SourceTab.CONTENT_CLASS= 'ctr-tab-content';

SourceTab.prototype.linkId = function() {
    return 'ctr_tablink_' + this.id;
};

SourceTab.prototype.init = function(data, content, error, prompts) {
    this.data = data;
    this.hasContent = !!content;
    this.hideLoading();
    this.rootEl.empty();
    if (this.hasContent) {
        this.rootEl.append(this.contentEl);
        this.contentEl.html(content);
        bindDataEvents(this.contentEl);
        this.navigationEl.addClass(SourceTab.ACTIVE_CLASS);
        if(this.contentType === ContentTypes.TRANSLATIONS){
            this._addTranslation.init(this,
                this.options.translationItemSelector,
                this.options.translationWordSelector);
            this.rootEl.append(this._addTranslation.el);
        }
    }
    else{
        this.navigationEl.removeClass(SourceTab.ACTIVE_CLASS);
         if (prompts)
            this.rootEl.append(this.createPromptsEl(prompts));
        else {
            if(error)
                this.rootEl.append(this.createErrorEl(error));
            else
                this.rootEl.append(this.createNoResultsErrorEl(this.contentType,this.data.word));
        }
    }
    this.adjustContentHeight();
};

SourceTab.prototype.createContentEl = function(){
    return $("<div/>",{
        'class': SourceTab.CONTENT_CLASS
    });
};

SourceTab.prototype.createNoResultsErrorEl = function(contentType, word){
    return this.createErrorEl('No ' + ContentTypes.getTitle(contentType).toLowerCase() + 
        ' for &quot;' + word + '&quot;');
};

SourceTab.prototype.createErrorEl = function(error){
    return $('<div/>',{
            html: error,
            'class': 'ctr-error-result'
        });
};

SourceTab.prototype.createPromptsEl = function(prompts){
  return $('<div/>',{
        html: prompts,
        'class': 'ctr-prompts'
    });  
};

SourceTab.prototype.createLoadingEl = function() {
    return $('<div/>', {
        'class': SourceTab.LOADING_CLASS,
        html: '<span>Loading '+ this.contentType +' for &quot;<span class="ctr-word"></span>&quot;</span>' +
            '<div class="ctr-spinner" style="margin-top:10px !important;display: block !important;"><div></div><div></div><div></div></div>'
    });
};

SourceTab.prototype.createNavigationEl = function(){
    var li = $('<li/>', { class: Source.ACTIVE_CLASS });
    var a = $('<a/>', {
        id: this.linkId(),
        html: this.title
    });
    li.append(a)
    this.navigationEl = li;
    return this.navigationEl;
};

SourceTab.prototype.showLoading = function(data,sourceName) {
    this.isLoading = true;
    this.loadingEl.find('.ctr-word').html(data.word);
    this.loadingEl.find('.ctr-sourceName').html(sourceName);
    this.rootEl.empty();
    this.rootEl.append(this.loadingEl);
};
SourceTab.prototype.hideLoading = function(data,sourceName) {
    this.isLoading = false;
    this.loadingEl.remove();
}

SourceTab.prototype.clear = function(){
    this.rootEl.empty();
};

SourceTab.prototype.adjustContentHeight = function() {
    if(this.hasContent) {
        this.contentEl[0].style.setProperty("overflow", "auto", "important");
        this.contentEl[0].style.maxHeight =
            document.documentElement.clientHeight -
            Dialog.headerEl.height() -
            this.navigationEl.height() -
            (this._addTranslation ? this._addTranslation.el.height() : 0) +
            'px';
    }
};

SourceTab.prototype.hide = function(){
    this.navigationEl.removeClass(SourceTab.SELECTED_CLASS);
    this.rootEl.hide();  
};

SourceTab.prototype.show = function(){
    // . show tab link
    this.navigationEl.addClass(SourceTab.SELECTED_CLASS);
    // . show tab content
    this.rootEl.show();
};

SourceTab.prototype.isActive = function(){
    return this.navigationEl.hasClass(SourceTab.ACTIVE_CLASS)
};

function bindDataEvents(el){
    el.find('[data-event]').each(function(i, elWithEvent){
        elWithEvent = $(elWithEvent);
        var eventParams = elWithEvent.data('event').split('|');
        var eventType = eventParams[0];
        var method = eventParams[1];
        var methodParams = eventParams.slice(2, eventParams.length);
        methodParams.forEach(function(param, index){
            if(param=='this')
                methodParams[index] = elWithEvent[0];
        });
        elWithEvent.on(eventType, function(e){
            window[method].apply(this,methodParams);
        });
    });
}

