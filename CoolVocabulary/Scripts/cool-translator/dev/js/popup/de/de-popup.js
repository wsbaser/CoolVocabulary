'use strict';

const LANG_CARD_TEMPLATE =
    '<div class="ctr-lang-card ctr-block">\
            <div class="ctr-lang-info">\
                <i class="ctr-flag-icon"></i>\
                <span class="ctr-lang-name"></span>\
            </div>\
            <div class="ctr-DE-status">\
                <a class="ctr-DE-link" target="_blank" style="display: none;">DAILY EXAMINATION</a>\
                <span class="ctr-DE-completed" style="display: none;">Daily examination completed</span>\
                <span class="ctr-DE-impossible" style="display: none;">No translations for examination</span>\
            </div>\
        </div>';

const NO_ANY_TRANSLATIONS_TEMPLATE =
    '<div class="ctr-warning-card ctr-block">\
        <span class="ctr-no-translations">\
            You do not have any translations at <a href="http://coolvocabulary.com" target="_blank" >coolvocabulary.com</a>\
        </span>\
    </div>';

export default class DEPopup{
    show(user) {
        // . set user name
        this.setUserName(user.name);
        // . render lang cards
        let hasRenderedCards = this.renderLangCards(user.languagesData);
        if (!hasRenderedCards) {
            this.showNoTranslationWarning();
        }
    }

    showNoTranslationWarning() {
        $('#ctr_root').html(NO_ANY_TRANSLATIONS_TEMPLATE);
    }

    setUserName(name) {
        $('.ctr-popup-header>a').text(name);
    }

    renderLangCards(languagesData) {
        let hasRenderedCards = false;
        for (let language in languagesData) {
            let languageData = languagesData[language];
            if (languageData.hasTranslations) {
                hasRenderedCards = true;
                this.renderLangCard(language, languageData);
            }
        }
        return hasRenderedCards;
    }

    renderLangCard(language, languageData) {
        let langCardEl = $(LANG_CARD_TEMPLATE);
        langCardEl.find('.ctr-flag-icon').addClass(language);
        langCardEl.find('.ctr-lang-name').text(languageData.languageName);
        let siteOrigin = NODE_ENV=='development'? 'http://localhost:13189/' : 'http://coolvocabulary.com/';
        let langDELink = siteOrigin + '#/' + language;
        langCardEl.find('.ctr-DE-link').attr('href', langDELink);
        if (languageData.DENotCompleted) {
            if (languageData.hasDE) {
                langCardEl.find('.ctr-DE-link').show();
            } else {
                langCardEl.find('.ctr-DE-impossible').show();
            }
        } else {
            langCardEl.find('.ctr-DE-completed').show();
        }
        $('#ctr_root').append(langCardEl);
    }
}