/**
 * Created by wsbaser on 15.07.2015.
 */

function AbbyService(config, provider){
	ServiceBase.call(this, config, provider,
		[ContentTypes.TRANSLATIONS,
		ContentTypes.EXAMPLES,
		ContentTypes.PHRASES]);
};

AbbyService.prototype = Object.create(ServiceBase.prototype);

AbbyService.prototype.generateTranslationsPrompts = function(contentEl){
    console.error('AbbyService.prototype.generateTranslationsPrompts not implemented');
    return null;
}

AbbyService.prototype.generateTranslationsCard = function(contentEl){
    if(contentEl){
        // . correct transcription image "src" attribute
        contentEl.find('.l-article__transcription').each(function (i, el) {
            var transcriptionSrc = this.config.domain + el.getAttribute('src');
            el.attr('src', transcriptionSrc);
        }.bind(this));

        // . Remove navigation panel
        contentEl.find('.l-article__navpanel').remove();

        // . Remove title from translations
        contentEl.find('.l-article__showExamp').each(function (i, itemEl) {
            itemEl.attr('title', '');
            itemEl.attr('href', 'javascript:void(0)');
        });

        // . deactivate links
        this.deactivateLinks(contentEl,'l-article__commentlink');
    }
    return contentEl;
};

AbbyService.prototype.generateExamplesCard = function(){
	if (contentEl){
        // . remove 'bad example' button
        contentEl.find('.l-examples__badexamp').remove();
        // . correct images "src" attribute
		this.set1pxAsSrc(contentEl, 'l-examples__switchbtn');
        // . configure
        contentEl.find('.js-examples-table-switchbtn').each(function (i, btnEl) {
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
    }
    return containerEl;
};

AbbyService.prototype.generatePhrasesCard = function(contentEl){
	if (contentEl){
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
            var srcword = srcwordEl.textContent.trim();
            var transl = translEl.textContent.trim();
            if (prevTransl === transl && prevSrcword === srcword)
                rows[i].remove();
            prevTransl = transl;
            prevSrcword = srcword;
        }
        this.deactivateLink(contentEl, 'l-phrases__link');
        var containerEl = $('<div/>', {'class': 'ctr-phrases-container'});
        containerEl.appendChild(contentEl);
    }
    return contentEl;
};