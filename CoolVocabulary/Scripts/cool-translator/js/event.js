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
	    	sourceLang: 'en',
	    	targetLang: chrome.i18n.getUILanguage()
	    };
};

function saveLangPair(langPair){
	localStorage.langPair = JSON.stringify(langPair);
};

/* Message listener */

function createServer(){
    var ll = new LLService(new LLProvider(LLConfig()))
    var abby = new AbbyService(new AbbyProvider(AbbyConfig()));
    var google = new GoogleService(new GoogleProvider(GoogleConfig()));
    var tfd = new TfdService(new TfdProvider(TfdConfig()));
    var cv = new CVService(new CVProvider(CVConfig()), [ll, abby, google, tfd]);
    var arr = [ll, abby, google, tfd, cv];
    var services = {};
    arr.forEach(function(service){
        services[service.config.id] = service;
    });
    return new DictionaryServicesServer(services);
};

var server = createServer();
server.startListening();

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

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    console.log('message from ' + sender.tab.id);
    if(request.initDialog){
        //$.cookie(request.initDialog.authCookie.name, request.initDialog.authCookie.value);
        chrome.tabs.sendMessage(sender.tab.id, {
            type: MessageTypes.InitSiteDialog,
            langPair: request.initDialog.langPair,
            attachBlockSelector: request.initDialog.attachBlockSelector,
            bookId: request.initDialog.bookId,
            user: request.initDialog.user
        });
        sendResponse(true);
    }
});

$.ajaxSetup({
    headers: {"X-Requested-With":"XMLHttpRequest"}
});
