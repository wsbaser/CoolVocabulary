// /* Injects scripts necessary to display dialog */

// function DialogInjector(){
// 	this.sources = ['abby','google','ll','tfd'];
// };


// DialogInjector.prototype.getSourceResourcePath = function(sourceId, file, ext){
// 	ext = ext||'js';
// 	var TMPL = "js/sources/{sourceId}/{sourceId}_{file}.{ext}";
// 	return strHelper.format(TMPL, { sourceId:sourceId, file:file, ext:ext });
// };


// /* Scripts */

// DialogInjector.prototype.injectScripts = function(tabId, callback){
// 	var scriptFiles = ["js/lib/jquery-1.10.2.min.js",
// 		"js/utils.js",
// 		"js/content_utils.js",
// 		"js/sources/common/content_types.js",
// 		"js/sources/common/dictionary_provider.js",
// 		"js/sources/common/dictionary_service.js",
// 		"js/sources/source_tab.js",
// 		"js/sources/source.js",
// 		"js/controls/add_translation.js",
// 		"js/controls/content_langselector.js",
// 		"js/controls/login_form.js",
// 		"js/controls/notification_popup.js"];
// 	$.each(this.sources, function(i,sourceId){
// 		scriptFiles.push(this.getSourceResourcePath(sourceId,'config'));
// 		scriptFiles.push(this.getSourceResourcePath(sourceId,'provider')),
// 		scriptFiles.push(this.getSourceResourcePath(sourceId,'service'));
// 	}.bind(this));
// 	scriptFiles.push("js/dialog.js");
// 	this.injectScriptFiles(scriptFiles, 0, tabId, callback);
// };

// DialogInjector.prototype.injectScriptFiles = function(scriptFiles, index, tabId, callback){
// 	if(index==scriptFiles.length)
// 		callback();
// 	chrome.tabs.executeScript(tabId, { file: scriptFiles[index] }, function(){
// 		this.injectScriptFiles(scriptFiles, index+1, tabId, callback);
// 	}.bind(this));
// }

// /* Styles */

// DialogInjector.prototype.injectStyles = function(tabId, callback){
// 	var cssFiles = ["css/dialog.css"];
// 	$.each(this.sources, function(i, sourceId) {
// 		cssFiles.push(this.getSourceResourcePath(sourceId, 'style', 'css'));
// 	}.bind(this));
// 	this.injectCssFiles(cssFiles,0,tabId,callback);
// };

// DialogInjector.prototype.injectCssFiles = function(cssFiles, index, tabId, callback){
// 	if(index==cssFiles.length)
// 		callback();
// 	chrome.tabs.insertCSS(tabId, { file: cssFiles[index] }, function(){
// 		this.injectCssFiles(cssFiles, index+1, tabId, callback);
// 	}.bind(this));
// };

// DialogInjector.prototype.inject = function(tabId, callback){
// 	this.injectScripts(tabId, function(){
// 		this.injectStyles(tabId, callback);
// 	}.bind(this));
// };

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
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
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