/***** SELECTION HELPER ***********************************************************************************************/

var selectionHelper = (function () {
    var selectionHelper = {};

    selectionHelper.getSelection = function() {
        return document.getSelection();
    };

    selectionHelper.saveSelection = function () {
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
            var sel = selectionHelper.getSelection();
            selection['type'] = 'simple';
            if (typeof sel.getRangeAt === 'function' && sel.rangeCount > 0) {
                selection['range'] = sel.getRangeAt(0).cloneRange();
            }
        }

        return selection;
    };

    selectionHelper.restoreSelection = function (selection) {
        var result = false;

        if (typeof selection['type'] !== 'undefined') {
            if (selection['type'] === 'input') {
                selection['element'].focus();
                selection['element'].setSelectionRange(selection['start'], selection['end']);
                result = true;
            } else if (selection['type'] === 'simple') {
                var sel = selectionHelper.getSelection();
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
    };

    return selectionHelper;
})();


function stopPropagation(e) {
    e.stopPropagation();
};

function cancelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function isInputDataEqual(data1, data2) {
    data1 = data1 || {};
    data2 = data2 || {};
    return data1.word == data2.word &&
        data1.sourceLang == data2.sourceLang &&
        data1.targetLang == data2.targetLang;
};
