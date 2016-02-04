'use strict';

import '../../styles/select-book.styl';

const TEMPLATE =
    '<div class="popover">\
    <div id="select_book_wrap">\
        <div class="header">Add "<span class="pair"></span>" to:</div>\
        <div class="ctr-hSplitter"></div>\
        <ul class="book-list"></ul>\
        <div class="ctr-hSplitter"></div>\
        <div class="actions">\
            <input type="checkbox">\
            Don\'t ask again(this page only)\
        </div>\
    </div>\
</div>';

export default class SelectBook{
    constructor(containerElementSelector) {
        this.containerElementSelector = containerElementSelector;
    }

    _createEl() {
        this.containerEl = $(this.containerElementSelector);
        this.containerEl.html(TEMPLATE);
        this.popoverEl = this.containerEl.children().first();
        this.el = this.popoverEl.children().first();
        this.listEl = this.el.find('.book-list');
    }

    _bindEvents() {
        let self = this;
        this.listEl.find('li').on('click', this._selectBook.bind(this));
        this.el.on('click', function(e) {
            e.stopPropagation();
        });
        this.containerEl.bind('click', function() {
            self.hide();
        });
        $(document).bind('keydown', function(e) {
            if (e.keyCode === 27) {
                self.hide();
                cancelEvent(e);
            }
        });
    }

    _selectBook(event) {
        let remember = this.el.find('input[type="checkbox"]')[0].checked;
        let selectedBookName = event.target.textContent;
        let bookId = this.books.filter(function(item) {
            return item.name === selectedBookName;
        })[0].id;
        this.loginCallback(bookId, remember);
    }

    _adjustListHeight() {
        this.listEl[0].style.setProperty("overflow", "auto", "important");
        this.listEl[0].style.maxHeight =
            (Dialog.el.height() - Dialog.headerEl.height() - 80) + 'px';
    }

    //***** PUBLIC ****************************************************************************************************

    show(books, word, translation, loginCallback) {
        let self = this;
        this._createEl();
        this.books = books;
        this.loginCallback = loginCallback;
        this.el.find('.header>.pair').text(word + ' - ' + translation);
        this.books.forEach(function(item) {

            self.listEl.append('<li>' + item.name + '</li>');
        });
        this._bindEvents();
        this._adjustListHeight();
        this.containerEl.show();
    }

    hide() {
        if (this.isVisible()) {
            this.containerEl.hide();
        }
    }

    isVisible() {
        return this.el && this.el.is(':visible');
    }
}