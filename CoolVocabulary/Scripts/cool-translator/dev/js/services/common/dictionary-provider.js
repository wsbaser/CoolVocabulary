'use strict';
import StringHelper from 'string-helper';

export default class DictionaryProvider {
    constructor(config) {
        this.config = config;
    }

    checkIfContentTypeSupported(contentType) {
        if (this.config.contentTypes.indexOf(contentType) === -1)
            throw new Error("Content type " + contentType + ' not supported.');
    }

    rejectWithStatusCode(deferred, xhr) {
        let statusText = xhr.statusText || 'error';
        deferred.reject(statusText + '. Status(' + xhr.status + ')');
    }

    rejectWithResponseText(deferred, xhr) {
        switch (xhr.status) {
            case 500:
            case 0:
                this.rejectWithStatusCode(deferred, xhr);
                break;
            default:
                if(xhr.responseText){
                    deferred.reject(xhr.responseText);
                }else{
                    this.rejectWithStatusCode(deferred, xhr);
                }
                break;
        }
    }

    resolveWithJQueryElement(deferred, data, selector) {
        deferred.resolve($(data).find(selector));
    }

    formatRequestUrl(url, data) {
        data = Object.create(data);
        let sourceLang = this.config.languages[data.sourceLang];
        let targetLang = this.config.languages[data.targetLang];
        data.sourceLangId = sourceLang && sourceLang.id;
        data.targetLangId = targetLang && targetLang.id;
        return StringHelper.format(url, data);
    }

    requestPage(urlTemplate, requestData, responseSelector) {
        let self = this;
        let deferred = $.Deferred();
        let translateUrl = this.formatRequestUrl(urlTemplate, requestData);
        console.log(translateUrl);
        let xhr = new XMLHttpRequest();
        xhr.open('GET', translateUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send();
        xhr.onreadystatechange = function() {
            if (xhr.readyState != 4) return;
            if (xhr.status != 200) {
                self.rejectWithStatusCode(deferred, xhr);
            } else {
                self.resolveWithJQueryElement(deferred, xhr.responseText, responseSelector);
            }
        }
        return deferred.promise();
    }

    getRequestName(contentType) {
        throw new Error('Not implemented');
    }

    getTranslationsData(requestData) {
        let cards = {};
        let deferred = this.requestTranslationsData(requestData);
        $.each(this.config.contentTypes, function(i, contentType) {
            cards[contentType] = deferred;
        });
        return cards;
    }
}