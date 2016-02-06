'use strict';

import '../../styles/language-selector.styl';

const SELECTED_CLASS = "ctr-selected";
const ACTIVE_CLASS = "ctr-active";

export default class LangSelector{
    constructor(rootSelector, languages, dialog, options) {
        this.el = $(rootSelector);
        this.el.addClass('ctr-lang-selector');
        this.languages = languages;
        this.dialog = dialog;
        this.options = options;

        this.selectedIndex = null;
        this.selectedLangEl = null;
        this.selectedItemEl = null;
        this.isActive = false;

        this.freezeEvents = true; // don't fire events during initialization
        this._initSelectedLang();
        this._initList();
        this.setSelectedLang(languages[0]);
        this._bindEvents();
        this.freezeEvents = false;
    }

    _initSelectedLang() {
        this.selectedLangEl = $('<a/>', {
            class: 'ctr-selected-lang ctr-flag-icon',
            click: this._onSelectedLangClick.bind(this)
        });
        this.el.append(this.selectedLangEl);
    }

    _onSelectedLangClick() {
        if (!this.isActive)
            this._showList();
    }

    _initList() {
        let self = this;
        this.langListEl = $('<ul/>', {
            class: 'ctr-lang-list'
        });
        for (let i = 0; i < this.languages.length; i++) {
            let languageEl = $('<li/>', {
                click: function() {
                    self._select($(this).index());
                    self.hideList(true);
                },
                title: this.languages[i]
            });
            languageEl.append($('<a/>', {
                'class': 'ctr-flag-icon ' + this.languages[i]
            }));
            this.langListEl.append(languageEl);
        }
        this.langListEl.hide();
        this.el.append(this.langListEl);
    }

    _bindEvents() {
        function cancelEvent(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        // . bind events for hiding
        document.addEventListener('click', function(e) {
            if (!$.contains(this.el[0], e.target))
                this.hideList();
        }.bind(this));
        document.addEventListener('keydown', function(e) {
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
            if (e.keyCode == 40) { // Down
                this._selectNext();
                return cancelEvent(e);
            }
            if (e.keyCode == 38) { // Up
                this._selectPrev();
                return cancelEvent(e);
            }
        }.bind(this));
    }

    _fireEvent(eventFunc) {
        if (eventFunc && !this.freezeEvents)
            eventFunc();
    }

    _showList() {
        this.oldSelectedIndex = this.selectedIndex;
        this.langListEl.show();
        this.dialog.inputEl.blur();
        this.el.addClass(ACTIVE_CLASS);
        this.isActive = true;
    }

    _select(index) {
        if (this.selectedItemEl) {
            this.selectedItemEl.removeClass(SELECTED_CLASS);
            this.selectedLangEl.removeClass(this.getSelectedLang());
        }

        let itemEl = $(this.langListEl.children()[index]);
        this.selectedItemEl = itemEl;
        this.selectedIndex = index;
        let selectedLang = this.getSelectedLang();
        this.selectedItemEl.addClass(SELECTED_CLASS);
        this.selectedLangEl.addClass(selectedLang);
        this.selectedLangEl.attr('title', selectedLang);

        this._fireEvent(this.options.onLangChange);
    }

    _selectNext() {
        if (!this.selectedItemEl[0].nextElementSibling)
            return;
        this._select(this.selectedIndex + 1);
    }

    _selectPrev() {
        if (!this.selectedItemEl[0].previousElementSibling)
            return;
        this._select(this.selectedIndex - 1);
    }

    /***** PUBLIC *********************************************************************************************************/
    hideList(acceptLang) {
        if (this.isActive) {
            this.langListEl.hide();
            this.el.removeClass(ACTIVE_CLASS);
            this.isActive = false;
            acceptLang ?
                this._fireEvent(this.options.onLangAccepted) :
                this._select(this.oldSelectedIndex);
            this._fireEvent(this.options.onLoseFocus);
        }
    }

    getSelectedLang() {
        return this.languages[this.selectedIndex];
    }

    setSelectedLang(lang, langEl, freezeEvents) {
        this.freezeEvents = this.freezeEvents || freezeEvents;
        if (langEl) {
            this.selectedLangEl = $(langEl);
            this.selectedLangEl.on("click", this._onSelectedLangClick.bind(this));
            this.el.prepend(this.selectedLangEl);
        }
        let selectedIndex = this.languages.indexOf(lang);
        this._select(selectedIndex);
        this._fireEvent(this.options.onLangAccepted);
        this.freezeEvents = false;
    }
}