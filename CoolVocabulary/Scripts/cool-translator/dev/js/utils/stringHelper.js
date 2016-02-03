'use strict';

export default {
    format: function (str, data) {
        for (let paramName in data) 
            str = str.replace(new RegExp('{' + paramName + '\\?(.*?)\\:(.*?)}', 'g'), data[paramName] ? '$1' : '$2');
        for (let paramName in data)
            str = str.replace(new RegExp('{'+paramName+'}', 'g'), data[paramName]);
        return str;
    },
    trimText: function(text) {
        return text.replace(/^[ \t\r\n]+|[ \t\r\n]+$/, '');
    },
    capitalizeFirstLetter: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
};