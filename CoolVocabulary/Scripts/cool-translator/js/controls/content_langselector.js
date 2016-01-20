/**
 * Created by wsbaser on 22.05.2015.
 */
/*
* @param rootId - id of LangSelector element in DOM
* @param languages - array of available languages
* @param selectedLanguage - name of initially selected language
* @param onLangChange - callback function called when user changes selected language in list
* @param onLangAccepted - callback function called when user accepted some language from list
* */

function LangSelector(rootSelector, languages, options) {
    this.el = $(rootSelector);
    this.el.addClass('ctr-lang-selector');
    this.languages = languages;
    this.options = options;

    this.selectedIndex = null;
    this.selectedLangEl = null;
    this.selectedItemEl=null;
    this.isActive = false;

    this.freezeEvents = true;   // don't fire events during initialization
    this._initSelectedLang();
    this._initList();
    this.setSelectedLang(languages[0]);
    this._bindEvents();
    this.freezeEvents = false;
};

LangSelector.SELECTED_CLASS = "ctr-selected";
LangSelector.ACTIVE_CLASS = "ctr-active";

LangSelector.prototype._initSelectedLang=function() {
    this.selectedLangEl = $('<a/>', {
        class: 'ctr-selected-lang ctr-flag-icon',
        click: this._onSelectedLangClick.bind(this)
    });
    this.el.append(this.selectedLangEl);
};

LangSelector.prototype._onSelectedLangClick = function() {
    if (!this.isActive)
        this._showList();
};

LangSelector.prototype._initList = function(){
    var self = this;
    this.langListEl = $('<ul/>',{class:'ctr-lang-list'});
    for (var i = 0; i < this.languages.length; i++) {
        var languageEl = $('<li/>', {
            click: function() {
                self._select($(this).index());
                self.hideList(true);
            },
            title:this.languages[i]});
        languageEl.append($('<a/>',{'class':'ctr-flag-icon '+this.languages[i]}));
        this.langListEl.append(languageEl);
    }
    this.langListEl.hide();
    this.el.append(this.langListEl);
};

LangSelector.prototype._bindEvents = function() {
    // . bind events for hiding
    document.addEventListener('click', function (e) {
        if (!$.contains(this.el[0],e.target))
            this.hideList();
    }.bind(this));
    document.addEventListener('keydown', function (e) {
        if (!this.isActive)
            return;
        if (e.keyCode === 27) { // Esc
            this.hideList();
            return cancelEvent(e);
        }
        if (e.keyCode === 13) { // Enter
            this.hideList(true);
            return cancelEvent(e);
        }
        if (e.keyCode == 40) {  // Down
            this._selectNext();
            return cancelEvent(e);
        }
        if (e.keyCode == 38) {  // Up
            this._selectPrev();
            return cancelEvent(e);
        }
    }.bind(this));
};

LangSelector.prototype._fireEvent = function (eventFunc) {
    if (eventFunc && !this.freezeEvents)
        eventFunc();
};

LangSelector.prototype._showList = function() {
    this.oldSelectedIndex = this.selectedIndex;
    this.langListEl.show();
    Dialog.inputEl.blur();
    this.el.addClass(LangSelector.ACTIVE_CLASS);
    this.isActive = true;
};

LangSelector.prototype._select = function(index) {
    if(this.selectedItemEl){
        this.selectedItemEl.removeClass(LangSelector.SELECTED_CLASS);
        this.selectedLangEl.removeClass(this.getSelectedLang());
    }

    var itemEl = $(this.langListEl.children()[index]);
    this.selectedItemEl = itemEl;
    this.selectedIndex = index;
    var selectedLang = this.getSelectedLang();
    this.selectedItemEl.addClass(LangSelector.SELECTED_CLASS);
    this.selectedLangEl.addClass(selectedLang);
    this.selectedLangEl.attr('title', selectedLang);

    this._fireEvent(this.options.onLangChange);
};

LangSelector.prototype._selectNext = function() {
    if (!this.selectedItemEl[0].nextElementSibling)
        return;
    this._select(this.selectedIndex + 1);
};

LangSelector.prototype._selectPrev = function() {
    if (!this.selectedItemEl[0].previousElementSibling)
        return;
    this._select(this.selectedIndex - 1);
};

/***** PUBLIC *********************************************************************************************************/
LangSelector.prototype.hideList = function(acceptLang) {
    if (this.isActive) {
        this.langListEl.hide();
        this.el.removeClass(LangSelector.ACTIVE_CLASS);
        this.isActive = false;
        acceptLang ?
            this._fireEvent(this.options.onLangAccepted) :
            this._select(this.oldSelectedIndex);
        this._fireEvent(this.options.onLoseFocus);
    }
};

LangSelector.prototype.getSelectedLang = function () {
    return this.languages[this.selectedIndex];
};

LangSelector.prototype.setSelectedLang = function (lang, langEl, freezeEvents) {
    this.freezeEvents = this.freezeEvents || freezeEvents;
    if (langEl) {
        this.selectedLangEl = $(langEl);
        this.selectedLangEl.on("click", this._onSelectedLangClick.bind(this));
        this.el.prepend(this.selectedLangEl);
    }
    var selectedIndex = this.languages.indexOf(lang);
    this._select(selectedIndex);
    this._fireEvent(this.options.onLangAccepted);
    this.freezeEvents = false;
};

/***** LANG SWITCHER **************************************************************************************************/

function LangSwitcher(selector1, selector2){
    this.switch = function(callback){
        selector1.freezeEvents = true;
        selector2.freezeEvents = true;
        selector1.hideList();
        selector2.hideList();

        var flagEl1 = selector1.selectedLangEl[0];
        var flagEl2 = selector2.selectedLangEl[0];

        // move flags
        var rect1 = flagEl1.getBoundingClientRect();
        var rect2 = flagEl2.getBoundingClientRect();
        var shift = parseInt(rect2.left) - parseInt(rect1.left);
        var style1 = getComputedStyle(flagEl1);
        var style2 = getComputedStyle(flagEl2);
        flagEl1.style.setProperty('opacity','0.5','important');
        flagEl2.style.setProperty('opacity','0.5','important');
        flagEl1.style.setProperty('left',(parseInt(style1.left) + shift) + 'px','important');
        flagEl2.style.setProperty('left', (parseInt(style2.left) - shift) + 'px','important');

        window.setTimeout(function(){
            flagEl1.parentNode.removeChild(flagEl1);
            flagEl2.parentNode.removeChild(flagEl2);
            flagEl1.removeAttribute('style');
            flagEl2.removeAttribute('style');
            var lang1 = selector1.getSelectedLang();
            var lang2 = selector2.getSelectedLang();
            selector1.setSelectedLang(lang2, flagEl2);
            // unfreaze events only for one selector
            // we do not need duplicated events
            selector1.freezeEvents=false;
            selector2.freezeEvents=false;
            selector2.setSelectedLang(lang1, flagEl1);
            if(callback){
                callback();
            }
        }.bind(this),550);
    };
}