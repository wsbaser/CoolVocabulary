function CTAdapter(){
	this.extensionIsActive = false;
	this.extensionId = DEBUG?
		"eplepheahdinbfhnjjnkhkebfdhenbad":
		"cifbpdjhjkopeekabdgfjgmcbcgloioi";
}

CTAdapter.CT_WEBSTORE_URL = 'https://chrome.google.com/webstore/detail/cifbpdjhjkopeekabdgfjgmcbcgloioi';

CTAdapter.prototype.logout = function(language, books){
	var self = this;
	if(window.chrome){
		var MESSAGE_TYPE = "logout";
		chrome.runtime.sendMessage(this.extensionId, {
			type: MESSAGE_TYPE
		});
	}
};

CTAdapter.prototype.updateLanguageBooks = function(language, books){
	var self = this;
	if(window.chrome){
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

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector, user, languages, bookId, callback){
	var self = this;
	if(window.chrome){
		var MESSAGE_TYPE = "initsitedialog";
		chrome.runtime.sendMessage(this.extensionId, {
			type: MESSAGE_TYPE,
			data: {
				langPair: langPair,
				attachBlockSelector: attachBlockSelector,
				user: user,
				languages: languages,
				bookId: bookId
			}
		},
		function(response) {
			self.extensionIsActive = !!response;
			callback();
		});
	}
	else{
		self.extensionIsActive = false;
		callback();
	}
};