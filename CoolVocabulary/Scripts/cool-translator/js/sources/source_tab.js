function SourceTab(contentType, options) {
    this.contentType = contentType;
    this.options = options ||{};
    if(contentType===ContentTypes.TRANSLATIONS){
        if(!options.translationItemSelector)
            throw new Error('Translation item selector not specified.');
        this._addTranslation = new AddTranslationControl();
    }
    this.title = ContentTypes.getTitle(this.contentType);
    this.rootEl = $('<div/>');
    this.rootEl.hide();
    this.loadingEl = null;
    this.navigationEl = null;
    this.hasContent = false;
    this.isLoading = false;
}

SourceTab.LOADING_CLASS = 'ctr-tab-loading';
SourceTab.ACTIVE_CLASS = 'ctr-active';
SourceTab.SELECTED_CLASS= 'ctr-selected';

SourceTab.prototype.linkId =function() {
    return 'ctr_tablink_' + this.id;
};

SourceTab.prototype.init = function(data,content,error) {
    this.data = data;
    this.contentEl = $(content);
    this.hasContent = !!content;
    bindDataEvents(this.contentEl);
    this.hideLoading();
    this.rootEl.empty();
    if (this.hasContent) {
        this.rootEl.append(this.contentEl);
        this.navigationEl.addClass(SourceTab.ACTIVE_CLASS)
        if(this.contentType === ContentTypes.TRANSLATIONS){
            this.addTranslationEl = this._addTranslation.createElement();
            this.rootEl.append(this.addTranslationEl);
            this._addTranslation.connectTranslationsList(this, 
                this.options.translationItemSelector,
                this.options.translationWordSelector);
        }
    }
    else {
        this.navigationEl.removeClass(SourceTab.ACTIVE_CLASS);
        if(error)
            this.rootEl.append(this.createErrorEl(error));
        else
            this.rootEl.append(this.createNoResultsErrorEl(this.contentType,this.data.inputWord));
    }
    this.adjustContentHeight();
};

SourceTab.prototype.createNoResultsErrorEl = function(contentType, word){
    return this.createErrorEl('No ' + ContentTypes.getTitle(contentType).toLowerCase() + 
        ' for &quote;' + word + '&quote;');
};

SourceTab.prototype.createErrorEl = function(error){
    return $('<div/>', {
            html: error,
            'class': 'ctr-error-result'
        });
};

SourceTab.prototype.createLoadingEl = function() {
    return $('<div/>', {
        'class': SourceTab.LOADING_CLASS,
        html: '<span>Loading '+ this.contentType +' for &quot;<span class="ctr-word"></span>&quot;</span>' +
            '<div class="ctr-spinner" style="margin-top:10px !important;display: block !important;"><div></div><div></div><div></div></div>'
    });
};

SourceTab.prototype.showLoading = function(data,sourceName) {
    this.isLoading = true;
    if (!this.loadingEl)
        this.loadingEl = this.createLoadingEl();
    this.loadingEl.find('.ctr-word').html(data.word);
    this.loadingEl.find('.ctr-sourceName').html(sourceName);
    this.rootEl.empty();
    this.rootEl.append(this.loadingEl);
};
SourceTab.prototype.hideLoading = function(data,sourceName) {
    this.isLoading = false;
    this.rootEl.empty();
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
            (this.addTranslationEl ? this.addTranslationEl.height() : 0) +
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

SourceTab.prototype.createNavigationEl = function(width){
    var li = $('<li/>', { class: Source.ACTIVE_CLASS });
    li[0].style.setProperty('width', width, 'important');
    var a = $('<a/>', {
        id: this.linkId(),
        html: this.title
    });
    li.append(a)
    this.navigationEl = li;
    return this.navigationEl;
};


function bindDataEvents(el){
    el.find('[data-event]').each(function(i, elWithEvent){
        elWithEvent = $(elWithEvent);
        var eventParams = elWithEvent.data('event').split(':');
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

