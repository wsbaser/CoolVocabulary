/***** Add Translation *****************************************************************************************************/

function AddTranslationControl(vocabulary) {
    this.vocabulary = vocabulary;
    this.translationsList = null;
    this.translationItemSelector = null;
    this._createEl();
};

AddTranslationControl.TRANSL_ITEM_CLASS ='ctr-translItem';

//===== Private ==========

AddTranslationControl.prototype._createEl = function(){
    this.el = $('<div/>', {'class':'ctr-addTransl-block'});
    this.el.html(AddTranslationControl.TEMPLATE);
    this.selectedTranslationEl = this.el.find('.ctr-selectedTransl');
    this.addButtonEl = this.el.find('.ctr-addButton');
    this.btnCaptionEl = this.addButtonEl.find('.ctr-btnCaption');
    this.spinnerEl = this.addButtonEl.find('.ctr-spinnerSmall');
};

AddTranslationControl.prototype._bindEvents = function() {
    this.addButtonEl.bind('click', this._onAddButtonClick.bind(this));
};

AddTranslationControl.TEMPLATE = 
'<div class="ctr-hSplitter"></div>\
<table>\
    <tbody>\
        <tr>\
            <td class="ctr-transl-col">\
                <input class="ctr-selectedTransl" readonly type="textbox" placeholder="Select translation">\
            </td>\
            <td class="ctr-addButton-col">\
                <a class="ctr-addButton">\
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
                <img class="ctr-lleoIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAwRJREFUeNpkU02IHEUU/upV9fT0zOx2NisahNVI1BwkrhhR0JOsaBAxKBFz8eBF8CeHkItHJSiCoAc9iIKCB2EPMQcFwXgQRC/+HIw/oAd1zSabmUlPz+72THdV1ytfTwiGTcHX1VX1vlffq/eeeebMCAGAidszeOfwev0wOhgjjvUjgieGmX2ntOHXxACLbYKvGFwLSwkPO4ZqnLlNsMH9cUynEEI3iXWidXguNaGa3XbVoKv+u4L7GKp3xj6uIsIRMW72UFvebzhEsm7L8ojgQUG008ExwVeBzEeflUcXFfzyTA4D+Vb9p+Zwgxifgg+r4HCaGXcGOSMykcgztytFz4q6Hmk82aHJgWzT94MLGA4dbMmrkcFrQnxUQqLJxKeXRlUvyy2Mt2UrIOyONC0RteRxQL6axqOifj/LJ/cwh/d6LXVRMx6CxOBLxiCzX+Rb/mdNCqYc9achhPPcS39TOjo4GefbHYp+mUvoHDPdNpl6FIW/e5A5TSyKRvZssPxKajASHkxtKyue16bZxpu2GL/EZu7dPTfelO/VrWUE0xoP7e//bPifzvXtiXkd0jmjPlmcN0USQkdCnhiT9CDxQ+ZVMvF3SNJD4MFpBL4VNc+lPfPB9T3/qi39h7valMwn9Dysfxou/HFhWB8z1GqDtEGc7j4AMm9ZhxXv5f1J/PsZXk50+La0/vNONzqJyp9o9uuK781y94aRTF2nlN4r5E+9w5I8Itg3CRZyLXmSiosJT1m5kTwflyyALWN94M56xtDYolgh4+4yycJSUKY5h+T48qemmZMYeEBS2V3rVxe6Wu3JN+u1YupflCRcNHVVfYOy+teVfz2m2+kdnrqqqyZAckWB1KbnWxY6amOQ+cN5HQ4S85dC/rupvqYXzjeoJ8WhanNrxdbRvojGy/mCO7yrIwGKpKpkWkxIXVL4EZeBKz3xfzMpWleaPm5kO+fa6333wrgVTrYUOsW2/6H2oZBK3Nl713Zj452UKsX47dG2/1o5vllq/ns5GZO6xhr/CTAAU+KSscJ7kCAAAAAASUVORK5CYII="/>\
                <a class="ctr-vocabularyName" target="_blank" href="http://lingualeo.com/ru/userdict">LinguaLeo</a>\
            </td>\
        </tr>\
    </tbody>\
</table>';

AddTranslationControl.prototype._onAddButtonClick = function() {
    var self = this;
    this._showLoading();
    self.vocabulary.checkAuthentication(function(promise){
        promise.done(function(isAuthenticated){
            if (isAuthenticated)
                self._addTranslation()
            else {
                self._hideLoading();
                self._showLoginForm();
            }
        }).fail(function(error){
            console.error("checkAuthentication error: "+ error);
        });
    });
};

AddTranslationControl.prototype._showLoginForm = function(){
    Dialog.showLoginForm(this.vocabulary, function () {
        this._addTranslation();
    }.bind(this));
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

AddTranslationControl.prototype._getTranslationItemWord= function(itemEl) {
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
}

AddTranslationControl.prototype.setTranslation = function(word) {
    this.selectedTranslationEl.val(word);
    if(word){
        this.selectedTranslationEl.addClass('ctr-hasValue');
        this.addButtonEl.addClass('ctr-active');
    }
    else {
        this.selectedTranslationEl.removeClass('ctr-hasValue');
        this.addButtonEl.removeClass('ctr-active');
    }
};