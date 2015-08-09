function CTAdapter(){
	this.connected = false;
};

CTAdapter.prototype.open = function(){
	console.log('send request to ');
};

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector){
	chrome.runtime.sendMessage("cljepjpcmioifpcbdblegllafplkdphm", {
		initDialog: {
			langPair: langPair,
			attachBlockSelector: attachBlockSelector
		}
	},
	function(response) {
		console.log(response);
	});
};