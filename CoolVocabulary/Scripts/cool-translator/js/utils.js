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
        for (var paramName in data) 
            str = str.replace(new RegExp('{' + paramName + '\\?(.*?)\\:(.*?)}', 'g'), data[paramName] ? '$1' : '$2');
        for (var paramName in data)
            str = str.replace(new RegExp('{'+paramName+'}', 'g'), data[paramName]);
        return str;
    };
    
    strHelper.trimText =function(text) {
        return text.replace(/^[ \t\r\n]+|[ \t\r\n]+$/, '');
    };

    strHelper.capitalizeFirstLetter=function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return strHelper;
})();

/***** Generate guid *************************************************************************************************/

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

jQuery.fn.outerHTML = function(s) {
    return s
        ? this.before(s).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

jQuery.fn.showImportant = function() {
    this.show();
    var displayValue = this[0].style['display'];
    this[0].style.setProperty('display',displayValue,'important');
};

function isCtrlPressed(event){
    var isMac = window.navigator.userAgent.toLowerCase().indexOf('macintosh') > -1;
    return (isMac ? event.metaKey : event.ctrlKey);
};