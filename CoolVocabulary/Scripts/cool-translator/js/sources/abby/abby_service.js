/**
 * Created by wsbaser on 15.07.2015.
 */

function AbbyService(provider){
	DictionaryService.call(this, provider.config, provider);
};

AbbyService.prototype = Object.create(DictionaryService.prototype);

AbbyService.prototype.generateTranslationsPrompts = function(contentEl){
    console.log('AbbyService.prototype.generateTranslationsPrompts not implemented');
    return null;
}

AbbyService.prototype.generateTranslationsCard = function(contentEl){
    if(contentEl.length){
        // . correct transcription image "src" attribute
        $.each(contentEl.find('.l-article__transcription'), function (i, el) {
            el = $(el);
            var transcriptionSrc = this.config.domain + el.attr('src');
            el.attr('src', transcriptionSrc);
        }.bind(this));

        // . Remove navigation panel
        contentEl.find('.l-article__navpanel').remove();

        // . Remove title from translations
        contentEl.find('.l-article__showExamp').each(function (i, itemEl) {
            itemEl = $(itemEl);
            itemEl.attr('title', '');
            itemEl.attr('href', 'javascript:void(0)');
        });

        // . deactivate links
        this.deactivateLinks(contentEl,'l-article__commentlink');
    }
    return contentEl.outerHTML();
};

AbbyService.prototype.generateExamplesCard = function(contentEl){
	if (contentEl.length){
        // . remove 'bad example' button
        contentEl.find('.l-examples__badexamp').remove();
        // . correct images "src" attribute
		this.set1pxAsSrc(contentEl, 'l-examples__switchbtn');
        // . configure
        contentEl.find('.js-examples-table-switchbtn').each(function (i, btnEl) {
            btnEl = $(btnEl);
            btnEl.click(function () {
                this.toggleClass('expanded');
                var row = this.closest('.js-examples-table-trans');
                var sourceEl = row.find('+* .js-examples-table-slidebox');
                if (this.hasClass('expanded')) {
                    this.attr("title", "Hide source");
                    sourceEl.slideDown();
                }
                else {
                    this.attr("title", "Show source");
                    sourceEl.slideUp();
                }
                return false;
            });
        });
        var containerEl = $('<div/>',{'class':'ctr-examples-container'});
        containerEl.append(contentEl);
        return containerEl.outerHTML();
    }
    return "";
    
};

AbbyService.prototype.generatePhrasesCard = function(contentEl){
	if (contentEl.length){
        // . correct images "src" attribute
        this.set1pxAsSrc(contentEl, 'g-tblresult__pointer');
        // . remove last column
        contentEl.find('.l-phrases__tblphrase__td').remove();
        // . remove duplicate rows
        var rows = contentEl.find('.js-phrases-table tr');
        var prevTransl, prevSrcword;
        for (var i = 0; i < rows.length; i++) {
            var srcwordEl = rows[i].find('.srcwords');
            var translEl = rows[i].find('.transl');
            if (!srcwordEl || !translEl)
                continue;
            var srcword = srcwordEl.text().trim();
            var transl = translEl.text().trim();
            if (prevTransl === transl && prevSrcword === srcword)
                rows[i].remove();
            prevTransl = transl;
            prevSrcword = srcword;
        }
        this.deactivateLinks(contentEl, 'l-phrases__link');
        var containerEl = $('<div/>', {'class': 'ctr-phrases-container'});
        containerEl.append(contentEl);
        return containerEl.outerHTML();
    }
    return "";
};