// ==UserScript==
// @name ContentUtils
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

var Classes = {};
Classes.ACTIVE = 'ctr-active';
Classes.SELECTED = 'ctr-selected';
Classes.SHOW = 'ctr-show';

/***** CSS HELPER *****************************************************************************************************/

var cssHelper = (function () {
    var cssHelper = {};

    cssHelper.addCss = function (cssCode, id) {
        if (id && document.getElementById(id))
            return;
        var styleElement = document.createElement("style");
        styleElement.type = "text/css";
        if (id)
            styleElement.id = id;
        if (styleElement.styleSheet){
            styleElement.styleSheet.cssText = cssCode;
        }else{
            styleElement.appendChild(document.createTextNode(cssCode));
        }
        var father = null;
        var heads = document.getElementsByTagName("head");
        if (heads.length>0){
            father = heads[0];
        }else{
            var bodies = document.getElementsByTagName("body");
            if (bodies.length>0){
                father = bodies[0];
            } else {
                //todo: do we really need this brunch? this is not corrctly working for XML documents in Chrome
                //if (typeof document.documentElement!='undefined'){
                //    father = document.documentElement
                //}
            }
        }
        if (father!=null)
            father.appendChild(styleElement);
    };
    return cssHelper;
})();

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

/***** TEMPLATES HELPER ***********************************************************************************************/

var templatesHelper = (function () {
    var templatesHelper = {};

    templatesHelper.formatStr = function(str, data) {
        for (var paramName in data) {
            if (data.hasOwnProperty(paramName)) {
                str = str.replace(new RegExp('{'+paramName+'}', 'g'), data[paramName]);
            }
        }
        return str;
    };

    templatesHelper.getTemplate = function(name,callback) {
        var dir = arguments.length==3?arguments[1]:null;
        var callback = arguments[arguments.length-1];
        kango.invokeAsync('cooltranslator.getTemplate', name, dir, function(response) {
            callback(response.html);
        });
    };

    return templatesHelper;
})();

function stopPropagation(e) {
    e.stopPropagation();
};

function cancelEvent(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}
