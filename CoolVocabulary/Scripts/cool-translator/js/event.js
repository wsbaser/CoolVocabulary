window.DEBUG = false;

function loadLangPair(){
	var langPair = null;
	if (localStorage.langPair){
		try{
			var obj = JSON.parse(localStorage.langPair)
			if(obj.sourceLang && obj.targetLang)
				langPair = obj;
		}
		catch(e){
		}
	}
	return langPair ||
		{
	    	sourceLang: chrome.i18n.getUILanguage()==='en'?'es':'en',
	    	targetLang: chrome.i18n.getUILanguage()
	    };
};

function saveLangPair(langPair){
	localStorage.langPair = JSON.stringify(langPair);
};

/* Message listener */

var Services = {};
Services.ll = new LLService(new LLProvider(LLConfig()))
Services.abby = new AbbyService(new AbbyProvider(AbbyConfig()));
Services.google = new GoogleService(new GoogleProvider(GoogleConfig()));
Services.linguee = new LingueeService(new LingueeProvider(LingueeConfig()));
Services.tfd = new TfdService(new TfdProvider(TfdConfig()));
Services.multitran = new MultitranService(new MultitranProvider(MultitranConfig()));
Services.cv = new CVService(new CVProvider(CVConfig()), [Services.ll, Services.abby, Services.google, Services.tfd, Services.linguee, Services.multitran]);

function createServer(){
    var services = {};
    for(var key in Services){
        if(Services.hasOwnProperty(key)){
            services[Services[key].config.id] = Services[key];
        }
    }
    return new DictionaryServicesServer(Services);
};

var server = createServer();
server.startListening();

Services.cv.checkAuthentication();
Services.cv.addEventListener(CVService.CHECK_AUTH_END, updateBadge);
Services.cv.addEventListener(CVService.USER_DATA_UPDATED, updateBadge);

function updateBadge(){
    var user = Services.cv.user;
    if(user){
        chrome.browserAction.setPopup({popup:'popup_de.html'});
        if(user.hasUncompletedDE){
            chrome.browserAction.setBadgeText({text:'>'});
        }else{
            chrome.browserAction.setBadgeText({text:''});
        }
    }
    else{
        chrome.browserAction.setPopup({popup:'popup_login.html'});
        chrome.browserAction.setBadgeText({text:''});
    }
};

chrome.runtime.onMessage.addListener(
  function(message, sender, callback) {
    switch(message.type){
        case MessageTypes.LoadInitializationData:
    		callback({
                langPair: loadLangPair()
            });
    		break;
		case MessageTypes.SaveLangPair:
			saveLangPair(message.langPair)
    		break;
      	default:
        	console.error('Unknown message type:' + message.type);
        	break;
    }
});

chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    switch(request.type){
        case MessageTypes.Authenticate:
            // . set user data
            Services.cv.setUser(request.data.user, request.data.languages);
            // . request additional user data
            Services.cv.checkAuthentication(true);
            sendResponse(true);
            break;
        case MessageTypes.InitSiteDialog:
            chrome.tabs.sendMessage(sender.tab.id, {
                type: MessageTypes.InitSiteDialog,
                langPair: request.data.langPair,
                attachBlockSelector: request.data.attachBlockSelector,
                bookId: request.data.bookId
            });
            break;
        case MessageTypes.UpdateLanguageBooks:
            Services.cv.updateLanguageBooks(request.data.language, request.data.books);
            break;
        case MessageTypes.Logout:
            Services.cv.setUser(null);
            break;
        case MessageTypes.OAuthSuccess:
            // . send "oauthsuccess" message to all tabs
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function(tab){
                    chrome.tabs.sendMessage(tab.id, {
                        type: MessageTypes.OAuthSuccess,
                        user: request.data.user
                    });
                });
            });
            Services.cv.setUser(request.data.user, request.data.languages);
            break;
    }
});

$.ajaxSetup({
    headers: {"X-Requested-With":"XMLHttpRequest"}
});
