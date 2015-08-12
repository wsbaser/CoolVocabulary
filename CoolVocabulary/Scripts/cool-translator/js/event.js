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
    var arr = [new AbbyService(new AbbyProvider(AbbyConfig())),
        new GoogleService(new GoogleProvider(GoogleConfig())),
        new TfdService(new TfdProvider(TfdConfig())),
        new LLService(new LLProvider(LLConfig()))];
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
        chrome.tabs.sendMessage(sender.tab.id, {
            type: MessageTypes.InitSiteDialog,
            langPair: request.initDialog.langPair,
            attachBlockSelector: request.initDialog.attachBlockSelector
        });
        sendResponse(true);
    }    
});