// ==UserScript==
// @name Utils
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

/**
 * Created by wsbaser on 20.04.2015.
 */

var dictionaryHelper = (function() {
    var dictionaryHelper = {};

    // excecute action for each item of dictionary
    dictionaryHelper.each = function(dict,action) {
        var keys = Object.keys(dict);
        for (var i = 0; i < keys.length; i++)
            action(keys[i], dict[keys[i]]);
    };

    dictionaryHelper.len = function(dict){
        return Object.keys(dict).length;
    };

    dictionaryHelper.first = function(dict){
        var keys = Object.keys(dict);
        if(keys.length===0)
            throw new Error('dictionaryHelper.first: Dictionary is empty');
        return dict[keys[0]];
    };

    dictionaryHelper.searchFirst = function(dict,isValid) {
        var keys = Object.keys(dict);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var item = dict[key];
            if (isValid(key, item))
                return item;
        }
        return null;
    };

    return dictionaryHelper;
})();

/***** BROWSER DETECTOR ***********************************************************************************************/

var browserDetector = (function () {
    var browserDetector = {
        userAgent: window.navigator.userAgent.toLowerCase(),
        getVersion: function() {
            return (this.userAgent.match( /.+(?:rv|it|ra|ie|me)[\/: ]([\d.]+)/ ) || [])[1];
        },
        isChrome: function() {
            return (/chrome/.test(this.userAgent));
        },
        isSafari: function() {
            return (/webkit/.test(this.userAgent) && !/chrome/.test(this.userAgent));
        },
        isOpera: function() {
            return (/opera/.test(this.userAgent));
        },
        isIE: function() {
            return (/msie/.test(this.userAgent) && !/opera/.test(this.userAgent));
        },
        isFirefox: function() {
            return (/firefox/.test(this.userAgent) && !/(compatible|webkit)/.test(this.userAgent));
        }
    };

    return browserDetector;
})();

/***** STRING HELPER **************************************************************************************************/

var strHelper= (function() {
    var strHelper = {};
    strHelper.format = function (str, data) {
        for (var paramName in data) {
            str = str.replace(new RegExp('{' + paramName + '\\?(.*?)\\:(.*?)}', 'g'), data[paramName] ? '$1' : '$2');
        }
        return templatesHelper.formatStr(str, data);
    };
    strHelper.trimText =function(text) {
        return text.replace(/^[ \t\r\n]+|[ \t\r\n]+$/, '');
    };

    strHelper.capitalizeFirstLetter=function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return strHelper;
})();

function extend(Child, Parent, additional) {
    var F = function () {
    };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Parent.prototype.constructor = Parent;
    Child.superclass = Parent.prototype;
    for (var x in additional)
        Child.prototype[x] = additional[x];
};

function notEmpty(obj){
    return !isEmpty(obj);
}

function isEmpty(obj) {
    return length(obj)===0;
}

function length(obj){
    if (obj == null) return 0;
    if (obj.length!=undefined) return obj.length;
    return Object.keys(obj);
}