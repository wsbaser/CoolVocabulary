window.DEBUG = true;

function DEPopup(){}

DEPopup.LANG_CARD_TEMPLATE = 
    	'<div class="ctr-lang-card ctr-block">\
			<div class="ctr-lang-info">\
				<i class="ctr-flag-icon"></i>\
				<span class="ctr-lang-name"></span>\
			</div>\
			<div class="ctr-DE-status">\
				<a class="ctr-DE-link" style="display: none;">DAILY EXAMINATION</a>\
				<span class="ctr-DE-completed" style="display: none;">Daily examination completed</span>\
			</div>\
		</div>';

DEPopup.prototype.show = function(){
    var bgWindow = chrome.extension.getBackgroundPage();
    var user = bgWindow.Services.cv.user;

    this.setUserName(user.name);
    this.renderLangCards(user.books);
};

DEPopup.prototype.renderLangCards = function(userBooks){
    var langToUserBooks = this.sortByLanguage(userBooks);
    var deCalculator = new DECalculator();
    for(var lang in langToUserBooks){
    	if(this.hasTranslations(langToUserBooks[lang])){
    		this.renderLangCard(deCalculator, lang, langToUserBooks[lang]);
    	}
    }
};

DEPopup.prototype.setUserName = function(name){
	$('.ctr-popup-header>a').text(name);
};

DEPopup.prototype.hasTranslations = function(userBooks){
	for (var i = userBooks.length - 1; i >= 0; i--) {
		if(Object.keys(userBooks[i].translations).length){
			return true;
		}
	};
	return false;
};

DEPopup.prototype.renderLangCard = function(deCalculator, language, userBooks){
    var langCardEl = $(DEPopup.LANG_CARD_TEMPLATE);
	langCardEl.find('.ctr-flag-icon').addClass(language);
    langCardEl.find('.ctr-lang-name').text(this.getLanguageName(language));
	var langDELink = (DEBUG?'http://localhost:13189/':'http://coolvocabulary.com/')+language+'/DE';
	langCardEl.find('.ctr-DE-link').attr('href', langDELink);
    if(deCalculator.hasDE(userBooks) && deCalculator.DENotCompleted(userBooks)){
    	langCardEl.find('.ctr-DE-link').show();
    }
    else{
    	langCardEl.find('.ctr-DE-completed').show();
	}
	$('#ctr_root').append(langCardEl);
};

DEPopup.prototype.getLanguageName = function(lang){
	switch(lang){
		case 'en':
			return 'English';
		case 'es':
			return 'Spanish';
		case 'pt':
			return 'Portuguese';
		case 'fr':
			return 'French';
		case 'it':
			return 'Italian';
		case 'de':
			return 'German';
		case 'ru':
			return 'Russian';
		case 'ar':
			return 'Arabic';
	}
};

DEPopup.prototype.sortByLanguage = function(userBooks){
	var langToUserBooks = {};
	userBooks.forEach(function(userBook){
		if(!langToUserBooks[userBook.language]){
			langToUserBooks[userBook.language] = [];
		}
		langToUserBooks[userBook.language].push(userBook);
	});
	return langToUserBooks;
};

window.onload = function(){
	var dePopup = new DEPopup();
	dePopup.show();
};