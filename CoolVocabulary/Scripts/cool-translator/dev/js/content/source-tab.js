'use strict';

import ContentTypes from '../services/common/content-types';

const LOADING_CLASS = 'ctr-tab-loading';
const ACTIVE_CLASS = 'ctr-active';
const SELECTED_CLASS = 'ctr-selected';
const CONTENT_CLASS = 'ctr-tab-content';

export default class SourceTab{
    constructor(serviceId, contentType, options) {
        this.serviceId = serviceId;
        this.contentType = contentType;
        this.options = options || {};
        this.title = ContentTypes.getTitle(this.contentType);
        this.rootEl = $('<div/>');
        this.rootEl.hide();
        this.contentEl = this._createContentEl();
        this.loadingEl = this._createLoadingEl();
        this.navigationEl = this._createNavigationEl();
        this.hasContent = false;
        this.isLoading = false;
        if (contentType === ContentTypes.TRANSLATIONS) {
            if (!options.translationItemSelector)
                throw new Error('Translation item selector not specified.');
            if (!options.vocabulary)
                throw new Error('vocabulary not specified.');
            this.addTranslation = new AddTranslationControl(options.serviceProvider);
        }
    }

    init(data, content, error, prompts) {
        this.data = data;
        this.hasContent = !!content;
        this.hideLoading();
        this.rootEl.empty();
        if (this.hasContent) {
            this.rootEl.append(this.contentEl);
            this.contentEl.html(content);
            this._bindDataEvents(this.contentEl);
            this.navigationEl.addClass(ACTIVE_CLASS);
            if (this.contentType === ContentTypes.TRANSLATIONS) {
                this.addTranslation.init(this,
                    this.options.translationItemSelector,
                    this.options.translationWordSelector);
                this.rootEl.append(this.addTranslation.el);
            }
        } else {
            this.navigationEl.removeClass(ACTIVE_CLASS);
            if (prompts)
                this.rootEl.append(this._createPromptsEl(prompts));
            else {
                if (error)
                    this.rootEl.append(this._createErrorEl(error));
                else
                    this.rootEl.append(this._createNoResultsErrorEl(this.contentType, this.data.word));
            }
        }
        this.adjustContentHeight();
    }

    _createContentEl() {
        return $("<div/>", {
            'class': CONTENT_CLASS
        });
    }

    _createNoResultsErrorEl(contentType, word) {
        return this._createErrorEl('No ' + ContentTypes.getTitle(contentType).toLowerCase() +
            ' for &quot;' + word + '&quot;');
    }

    _createErrorEl(error) {
        return $('<div/>', {
            html: error,
            'class': 'ctr-error-result'
        });
    }

    _createPromptsEl(prompts) {
        return $('<div/>', {
            html: prompts,
            'class': 'ctr-prompts'
        });
    }

    _createLoadingEl() {
        return $('<div/>', {
            'class': LOADING_CLASS,
            html: '<span>Loading ' + this.contentType + ' for &quot;<span class="ctr-word"></span>&quot;</span>' +
                '<div class="ctr-spinner" style="margin-top:10px !important;display: block !important;"><div></div><div></div><div></div></div>'
        });
    }

    _createNavigationEl() {
        let li = $('<li/>', {
            class: Source.ACTIVE_CLASS
        });
        let a = $('<a/>', {
            html: this.title
        });
        li.append(a)
        this.navigationEl = li;
        return this.navigationEl;
    }

    _bindDataEvents(el) {
        el.find('[data-event]').each(function(i, elWithEvent) {
            elWithEvent = $(elWithEvent);
            let eventParams = elWithEvent.data('event').split('|');
            let eventType = eventParams[0];
            let method = eventParams[1];
            let methodParams = eventParams.slice(2, eventParams.length);
            methodParams.forEach(function(param, index) {
                if (param == 'this')
                    methodParams[index] = elWithEvent[0];
            });
            elWithEvent.on(eventType, function(e) {
                let func = window;
                let arr = method.split('.').forEach(function(name) {
                    func = func[name];
                });
                func.apply(this, methodParams);
            });
        });
    }

    //***** PUBLIC *****************************************************************************************************

    show() {
        // . show tab link
        this.navigationEl.addClass(SELECTED_CLASS);
        // . show tab content
        this.rootEl.show();
        this.adjustContentHeight();
    }

    hide() {
        this.navigationEl.removeClass(SELECTED_CLASS);
        this.rootEl.hide();
    }

    isActive() {
        return this.navigationEl.hasClass(ACTIVE_CLASS)
    }

    showLoading(data, sourceName) {
        if (!this.isLoading) {
            this.isLoading = true;
            this.loadingEl.find('.ctr-word').html(data.word);
            this.loadingEl.find('.ctr-sourceName').html(sourceName);
            this.navigationEl.removeClass(ACTIVE_CLASS);
            this.rootEl.empty();
            this.rootEl.append(this.loadingEl);
        }
    }

    hideLoading(data, sourceName) {
        this.isLoading = false;
        this.loadingEl.remove();
    }

    clear() {
        this.rootEl.empty();
    }

    adjustContentHeight() {
        if (this.hasContent) {
            this.contentEl[0].style.setProperty("overflow", "auto", "important");
            let rect = this.contentEl[0].getBoundingClientRect();
            this.contentEl[0].style.maxHeight =
                document.documentElement.clientHeight -
                rect.top - 2 -
                (this.addTranslation ? this.addTranslation.el.height() : 0) +
                'px';
        }
    }
}