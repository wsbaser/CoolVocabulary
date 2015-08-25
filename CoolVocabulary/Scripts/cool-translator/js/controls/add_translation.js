/***** Add Translation *****************************************************************************************************/

function AddTranslationControl(vocabulary) {
    this.vocabulary = vocabulary;
    this.translationsList = null;
    this.translationItemSelector = null;
    this._createEl();
    var self = this;
    document.addEventListener('ctrbookchanged', function(event, bookName){
        self._selectBook(bookName)
    });
    this.books = null;
};

AddTranslationControl.TRANSL_ITEM_CLASS ='ctr-translItem';

//===== Private ==========
AddTranslationControl.prototype._selectBook = function(bookName){
    this.booksEl.find('option:contains(' + bookName + ')').prop('selected', true);
};

AddTranslationControl.prototype._getSelectedBookId = function(){
    return this.booksEl.is(':visible')?
        this.booksEl.find('option:selected').data('bookid'):
        null;
};

AddTranslationControl.prototype._getBooks = function(callback){
    var self = this;
    if(this.books)
        callback();
    else {
        this.vocabulary.getBooks(function(promise){
            promise.done(function(books){
                self.books = books;
                callback();
            }).fail(function(){
                self._hideLoading();
            });
        });
    }
};

AddTranslationControl.prototype._showDefaultBook= function(language){
    var DEFAULT_BOOK_NAME = 'New words';
    this.booksEl.append('<option>'+DEFAULT_BOOK_NAME+'</option>');
};

AddTranslationControl.prototype._showBooks= function(language){
    var self = this;
    this.booksEl.empty();
    if(this.books && this.books.length){
        $.each(this.books, function(i, book){
            if(getLangByIndex(book.Language)==language);{
                var bookEl = $('<select>' + book.Name + '</select>');
                bookEl.data('bookid', book.ID);
                self.booksEl.append(bookEl);
            }
        });
    }
    else
        this._showDefaultBook();
    self.booksEl.showImportant();
};


AddTranslationControl.prototype._createEl = function(){
    this.el = $('<div/>', {'class':'ctr-addTransl-block'});
    this.el.html(AddTranslationControl.TEMPLATE);
    this.selectedTranslationEl = this.el.find('.ctr-selectedTransl');
    this.buttonEl = this.el.find('.ctr-button');
    this.btnCaptionEl = this.buttonEl.find('.ctr-btnCaption');
    this.spinnerEl = this.buttonEl.find('.ctr-spinnerSmall');
    this.booksEl = this.el.find('.ctr-vocabularyBooks');

    var vocabularyEl = this.el.find('.ctr-vocabulary-col');
    if(this.vocabulary.config.iconBase64)
        vocabularyEl.find('.ctr-vocabularyIcon').attr('src',this.vocabulary.config.iconBase64);
    var vocabularyNameEl = vocabularyEl.find('.ctr-vocabularyName');
    vocabularyNameEl.text(this.vocabulary.config.name);
    vocabularyNameEl.attr('href', this.vocabulary.config.path.vocabulary);
    this._showDefaultBook();
};

AddTranslationControl.prototype._bindEvents = function() {
    var self = this;
    this.buttonEl.bind('click', this._onButtonClick.bind(this));
    this.booksEl.change(function(){
        var bookName = self.booksEl.find('option:selected').text();
        $(document).trigger('ctrbookchanged', bookName);
    });
};

AddTranslationControl.TEMPLATE = 
'<div class="ctr-hSplitter"></div>\
<table>\
    <tbody>\
        <tr>\
            <td class="ctr-transl-col">\
                <input class="ctr-selectedTransl" readonly type="textbox" placeholder="Select translation">\
            </td>\
            <td class="ctr-button-col">\
                <a class="ctr-button">\
                    <span class="ctr-btnCaption">\
                        <span class="ctr-addIcon"></span>\
                        &nbsp;Add\
                    </span>\
                    <div class="ctr-spinnerSmall">\
                      <div></div>\
                      <div></div>\
                      <div></div>\
                    </div>\
                </a>\
            </td>\
            <td class="ctr-vocabulary-col">\
                <span>&nbsp;&nbsp;&nbsp;to</span>\
                <img class="ctr-vocabularyIcon" src=""/>\
                <a class="ctr-vocabularyName" target="_blank" href=""></a>\
                <select class="ctr-vocabularyBooks"></select>\
            </td>\
        </tr>\
    </tbody>\
</table>';

AddTranslationControl.prototype.checkAuthentication = function() {
    var self = this;
    this._showLoading();
    this.vocabulary.checkAuthentication(function(promise){
        promise.done(function(isAuthenticated){
            if (isAuthenticated){
                self.logedIn = true;
                self._getBooks(function(){
                    self._showBooks(self.translationsList.data.sourceLang);
                    self._hideLoading();
                });
            }
            else{
                self._hideLoading();
                self.logedIn = false;
            }
        });
    });
}

AddTranslationControl.prototype._onButtonClick = function() {
    var self = this;
    // if(this.logedIn)
        self._addTranslation()
    // else
    //     self._showLoginForm();
};

AddTranslationControl.prototype._showLoginForm = function(){
    var self = this;
    Dialog.showLoginForm(this.vocabulary, function () {
        self.logedIn = true;
        self._showLoading();
        self._getBooks(function(){
            self._showBooks(self.translationsList.data.sourceLang);
            self._hideLoading();
        });
    });
};

AddTranslationControl.prototype._showLoading = function() {
    this.btnCaptionEl.css('visibility','hidden');
    this.spinnerEl.show();
};

AddTranslationControl.prototype._hideLoading = function() {
    this.btnCaptionEl.css('visibility','visible')
    this.spinnerEl.hide();
};

AddTranslationControl.prototype._addTranslation = function() {
    var self = this;
    var inputData = this.translationsList.data;
    var translation = this.selectedTranslationEl.val();
    this._showLoading();
    this.vocabulary.addTranslation(inputData,translation,function(promise){
        promise.done(function(response){
            response = response || {};
            self._hideLoading();
            self._showTranslationAddedNotification(inputData, translation);
            if(isInputDataEqual(self.translationsList.data, inputData))
                self._highlightAddedTranslation(translation);
            self.setTranslation('');
        }).fail(function(response){
            self._hideLoading();
            if (response.notAuthenticated)
                self._showLoginForm();
            else
                self._showAddTranslationError(response);
        });
    });
};

AddTranslationControl.prototype._showTranslationAddedNotification = function(inputData,translation) {
    Dialog.showNotification('Translation added to LinguaLeo',
        inputData.word + ' - ' + translation);
};

AddTranslationControl.prototype._showAddTranslationError = function(error_msg) {
    Dialog.showError(error_msg);
};

AddTranslationControl.prototype._selectTranslationItem = function(e) {
    var targetItemEl = $(e.target).closest(this.translationItemSelector);
    if (!targetItemEl[0])
        throw new Error('click not inside translation item');
    if(targetItemEl.hasClass('ctr-added'))
        return;
    this.setTranslation(this._getTranslationItemWord(targetItemEl));
    this._forEachTranslationItem(function (i, itemEl) {
        itemEl = $(itemEl);
        targetItemEl[0] === itemEl[0] ?
            itemEl.addClass('ctr-selected') :
            itemEl.removeClass('ctr-selected');
    });
    e.preventDefault();
    return false;
};

AddTranslationControl.prototype._forEachTranslationItem = function(action) {
    $.each(this.translationsList.rootEl.find(this.translationItemSelector), action);
};

AddTranslationControl.prototype._getTranslationItemWord = function(itemEl) {
    return (this.translationWordSelector ? itemEl.find(this.translationWordSelector) : itemEl)
        .text().trim();
};

AddTranslationControl.prototype._highlightAddedTranslation = function (translation) {
    this._forEachTranslationItem(
        function (i, itemEl) {
            itemEl = $(itemEl);
            if (this._getTranslationItemWord(itemEl) === translation) {
                itemEl.removeClass('ctr-selected');
                itemEl.addClass('ctr-added');
            }
        }.bind(this));
};

//===== Public ==========

AddTranslationControl.prototype.init = function(translationsList, translationItemSelector,translationWordSelector) {
    this.setTranslation('');
    var self = this;
    this.translationsList = translationsList;
    this.translationItemSelector = translationItemSelector;
    this.translationWordSelector = translationWordSelector;
    this._forEachTranslationItem(function (i, itemEl) {
        itemEl = $(itemEl);
        itemEl.addClass(AddTranslationControl.TRANSL_ITEM_CLASS);
        itemEl.on('click', self._selectTranslationItem.bind(self));
    });
    this._bindEvents();
    //this.checkAuthentication();
}

AddTranslationControl.prototype.setTranslation = function(word) {
    this.selectedTranslationEl.val(word);
    if(word){
        this.selectedTranslationEl.addClass('ctr-hasValue');
        this.buttonEl.addClass('ctr-active');
    }
    else {
        this.selectedTranslationEl.removeClass('ctr-hasValue');
        this.buttonEl.removeClass('ctr-active');
    }
};