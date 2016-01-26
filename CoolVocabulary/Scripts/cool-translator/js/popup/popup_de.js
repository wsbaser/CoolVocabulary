window.DEBUG = true;

function DEPopup(){}

DEPopup.LANG_CARD_TEMPLATE = 
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

DEPopup.prototype.show = function(user){
    // . set user name
    this.setUserName(user.name);
    // . render lang cards
    if(Object.keys(user.languagesData).length){
    	this.renderLangCards(user.languagesData);
    }
    else{
    	this.showNoTranslationWarning();
    }
};

DEPopup.prototype.showNoTranslationWarning = function(){
	$('#ctr_root').html('<span class="ctr-no-translations">You have no translations.</span>');
};

DEPopup.prototype.setUserName = function(name){
	$('.ctr-popup-header>a').text(name);
};

DEPopup.prototype.renderLangCards = function(languagesData){
    for(var language in languagesData){
		var languageData = languagesData[language];
		if(languageData.hasTranslations){
    		this.renderLangCard(language, languageData);
		}
    }
};

DEPopup.prototype.renderLangCard = function(language, languageData){
    var langCardEl = $(DEPopup.LANG_CARD_TEMPLATE);
	langCardEl.find('.ctr-flag-icon').addClass(language);
    langCardEl.find('.ctr-lang-name').text(languageData.languageName);
	var langDELink = (DEBUG?'http://localhost:13189/':'http://coolvocabulary.com/')+'#/'+language;
	langCardEl.find('.ctr-DE-link').attr('href', langDELink);
    if(languageData.hasDE){
    	if(languageData.DENotCompleted){
    		langCardEl.find('.ctr-DE-link').show();
    	}
    	else{
    		langCardEl.find('.ctr-DE-completed').show();
    	}
    }
    else {
    	langCardEl.find('.ctr-DE-impossible').show();
    }
	$('#ctr_root').append(langCardEl);
};

window.onload = function(){
	var dePopup = new DEPopup();
    var bgWindow = chrome.extension.getBackgroundPage();
	dePopup.show(bgWindow.Services.cv.user);
};