function CTAdapter(){
	this.extensionIsActive = false;
}

CTAdapter.prototype.open = function(){
	console.log('send request to ');
};

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector, user, bookId, callback){
	var self = this;
	if(window.chrome){
		var extensionId = DEBUG?
			"eplepheahdinbfhnjjnkhkebfdhenbad":
			"cifbpdjhjkopeekabdgfjgmcbcgloioi";
		chrome.runtime.sendMessage(extensionId, {
			initDialog: {
				langPair: langPair,
				attachBlockSelector: attachBlockSelector,
				user: user,
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