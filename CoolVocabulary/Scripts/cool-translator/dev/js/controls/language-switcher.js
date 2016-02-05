'use strict';

export default class LangSwitcher {
    constructor(selector1, selector2) {
        this.selector1 = selector1;
        this.selector2 = selector2;
    }

    switch (callback) {
        this.selector1.freezeEvents = true;
        this.selector2.freezeEvents = true;
        this.selector1.hideList();
        this.selector2.hideList();

        let flagEl1 = this.selector1.selectedLangEl[0];
        let flagEl2 = this.selector2.selectedLangEl[0];

        // move flags
        let rect1 = flagEl1.getBoundingClientRect();
        let rect2 = flagEl2.getBoundingClientRect();
        let shift = parseInt(rect2.left) - parseInt(rect1.left);
        let style1 = getComputedStyle(flagEl1);
        let style2 = getComputedStyle(flagEl2);
        flagEl1.style.setProperty('opacity', '0.5', 'important');
        flagEl2.style.setProperty('opacity', '0.5', 'important');
        flagEl1.style.setProperty('left', (parseInt(style1.left) + shift) + 'px', 'important');
        flagEl2.style.setProperty('left', (parseInt(style2.left) - shift) + 'px', 'important');

        window.setTimeout(function() {
            flagEl1.parentNode.removeChild(flagEl1);
            flagEl2.parentNode.removeChild(flagEl2);
            flagEl1.removeAttribute('style');
            flagEl2.removeAttribute('style');
            let lang1 = this.selector1.getSelectedLang();
            let lang2 = this.selector2.getSelectedLang();
            this.selector1.setSelectedLang(lang2, flagEl2);
            // unfreaze events only for one selector
            // we do not need duplicated events
            this.selector1.freezeEvents = false;
            this.selector2.freezeEvents = false;
            this.selector2.setSelectedLang(lang1, flagEl1);
            if (callback) {
                callback();
            }
        }.bind(this), 550);
    }
}