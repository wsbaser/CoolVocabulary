function CTAdapter(){
	this.extensionIsActive = false;
}

CTAdapter.prototype.open = function(){
	console.log('send request to ');
};

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector,callback){
	var self = this;
	chrome.runtime.sendMessage("cljepjpcmioifpcbdblegllafplkdphm", {
		initDialog: {
			langPair: langPair,
			attachBlockSelector: attachBlockSelector
		}
	},
	function(response) {
		self.extensionIsActive = !!response;
		callback();
	});
};