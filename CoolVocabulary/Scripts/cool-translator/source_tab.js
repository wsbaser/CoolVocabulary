function SourceTab(contentType,options) {
    this.contentType = contentType;
    this.options = options ||{};
    if(contentType===ContentTypes.TRANSLATIONS){
        if(!options.translationItemSelector)
            throw new Error('Translation selector not specified.');
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

SourceTab.prototype.linkId =function() {
    return 'ctr_tablink_' + this.id;
};

SourceTab.prototype.init = function(data,contentEl,error) {
    this.isLoading = false;
    this.data = data;
    this.contentEl = contentEl;
    this.hasContent = !!this.contentEl;
    this.rootEl.innerHTML = '';
    if (this.hasContent) {
        this.rootEl.appendChild(this.contentEl);
        this.navigationEl.addClass(Classes.ACTIVE)
        if(this.contentType === ContentTypes.TRANSLATIONS){
            this.addTranslationEl = this._addTranslation.createElement();
            this.rootEl.appendChild(this.addTranslationEl);
            this._addTranslation.connectTranslationsList(tab, 
                this.options.translationItemSelector,
                this.options.translationWordSelector);
        }
    }
    else {
        this.navigationEl.removeClass(Classes.ACTIVE);
        if(error)
            this.rootEl.appendChild(this.createErrorEl(error));
        else
            this.rootEl.appendChild(this.createNoResultsErrorEl(this.contentType,this.data.inputWord));
    }
    this.adjustContentHeight();
};

SourceTab.prototype.createNoResultsErrorEl = function(contentType, word){
    return this.createErrorEl('No ' + ContentTypes.getTitle(contentType).toLower() + 
        ' for &quote;' + word + '&quote;');
};

Source.prototype.createErrorEl = function(error){
    return $('<div/>',{html:error});
};

SourceTab.prototype.createLoadingEl = function() {
    return $('<div/>', {
        'class': SourceTab.LOADING_CLASS,
        html: '<span>Loading '+ this.contentType +' for &quot;<span class="ctr-word"></span>&quot;</span>' +
            '<div class="ctr-spinner" style="margin-top:10px !important;display: block !important;"><div></div><div></div><div></div></div>';
    });
};

SourceTab.prototype.showLoading = function(data,sourceName) {
    this.isLoading = true;
    if (!this.loadingEl)
        this.loadingEl = this.createLoadingEl();
    this.loadingEl.getElementsByClassName('ctr-word')[0].innerHTML = data.word;
    this.loadingEl.getElementsByClassName('ctr-sourceName')[0].innerHTML = sourceName;
    this.rootEl.innerHTML = '';
    this.rootEl.appendChild(this.loadingEl);
};
SourceTab.prototype.clear = function(){
    this.rootEl.innerHTML = '';
};
SourceTab.prototype.adjustContentHeight = function() {
    if(this.hasContent) {
        this.contentEl.style.setProperty("overflow", "auto", "important");
        this.contentEl.style.maxHeight =
            document.documentElement.clientHeight -
            Dialog.headerEl.clientHeight -
            this.navigationEl.clientHeight -
            (this.addTranslationEl ? this.addTranslationEl.clientHeight : 0) +
            'px';
    }
};