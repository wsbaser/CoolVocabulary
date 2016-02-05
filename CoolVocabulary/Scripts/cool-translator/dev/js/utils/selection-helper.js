'use strict';

export default {
    getSelection: function() {
        return document.getSelection();
    },
    saveSelection: function () {
        var selection = {};

        var inputElement = null;
        var actElem = document.activeElement;
        var tagName = actElem.tagName;
        if (typeof tagName !== 'undefined') {
            tagName = tagName.toLowerCase();
            if (tagName === 'textarea' || tagName === 'input' && actElem.type.toLowerCase() === 'text') {
                inputElement = actElem;
            }
        }

        if (inputElement) {
            // Selection inside input elements must be saved in different way to restore it afterwards
            selection['type'] = 'input';
            selection['element'] = inputElement;
            selection['start'] = inputElement.selectionStart;
            selection['end'] = inputElement.selectionEnd;
        } else {
            var sel = this.getSelection();
            selection['type'] = 'simple';
            if (typeof sel.getRangeAt === 'function' && sel.rangeCount > 0) {
                selection['range'] = sel.getRangeAt(0).cloneRange();
            }
        }

        return selection;
    },
    restoreSelection: function (selection) {
        var result = false;

        if (typeof selection['type'] !== 'undefined') {
            if (selection['type'] === 'input') {
                selection['element'].focus();
                selection['element'].setSelectionRange(selection['start'], selection['end']);
                result = true;
            } else if (selection['type'] === 'simple') {
                var sel = this.getSelection();
                if (typeof sel.removeAllRanges === 'function') {
                    try {
                        sel.removeAllRanges(); //sometimes gets exception in IE
                    } catch (e) {}
                    if (typeof selection['range'] !== 'undefined') {
                        sel.addRange(selection['range']);
                        result = true;
                    }
                }
            }
        }

        return result;
    }
};