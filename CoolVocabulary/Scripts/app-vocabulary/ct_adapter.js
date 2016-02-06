function CTAdapter(){
	this.extensionIsActive = undefined;
	this.extensionId = DEBUG?
		"ppgnibapoaghkefnghplaanppljbhboo":
		"cifbpdjhjkopeekabdgfjgmcbcgloioi";
	this.isChrome = 
		window.chrome &&
		window.chrome.runtime &&
		window.chrome.runtime.sendMessage;
}

CTAdapter.CT_WEBSTORE_URL = 'https://chrome.google.com/webstore/detail/cifbpdjhjkopeekabdgfjgmcbcgloioi';

CTAdapter.prototype.logout = function(language, books){
	var self = this;
	if(this.isChrome){
		var MESSAGE_TYPE = "logout";
		chrome.runtime.sendMessage(this.extensionId, {
			type: MESSAGE_TYPE
		});
	}
};

CTAdapter.prototype.authenticate = function(user, languages, callback){
	var self = this;
	if(this.isChrome){
		var MESSAGE_TYPE = "authenticate";
		chrome.runtime.sendMessage(this.extensionId, {
			type: MESSAGE_TYPE,
			data: {
				user: user,
				languages: languages
			}
		},
		function(response) {
			self.extensionIsActive = !!response;
			callback();
		});
	} else{
		self.extensionIsActive = false;
		callback();
	}
};

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector, bookId){
	var self = this;
	if(this.isChrome){
		var MESSAGE_TYPE = "initsitedialog";
		chrome.runtime.sendMessage(this.extensionId, {
			type: MESSAGE_TYPE,
			data: {
				langPair: langPair,
				attachBlockSelector: attachBlockSelector,
				bookId: bookId
			}
		});
	}
};

CTAdapter.prototype.updateLanguageBooks = function(language, books){
	var self = this;
	if(this.isChrome){
		var MESSAGE_TYPE = "updatelanguagebooks";
		chrome.runtime.sendMessage(this.extensionId, {
			type: MESSAGE_TYPE,
			data: {
				language: language,
				books: books
			}
		});
	}
};