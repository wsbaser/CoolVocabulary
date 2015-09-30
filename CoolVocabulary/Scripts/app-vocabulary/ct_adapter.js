function CTAdapter(){
	this.extensionIsActive = false;
}

CTAdapter.prototype.open = function(){
	console.log('send request to ');
};

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector, authCookie, callback){
	var self = this;
	chrome.runtime.sendMessage("eplepheahdinbfhnjjnkhkebfdhenbad", {
		initDialog: {
			langPair: langPair,
			attachBlockSelector: attachBlockSelector,
			authCookie: authCookie
		}
	},
	function(response) {
		self.extensionIsActive = !!response;
		callback();
	});
};