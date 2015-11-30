function CTAdapter(){
	this.extensionIsActive = false;
}

CTAdapter.prototype.open = function(){
	console.log('send request to ');
};

CTAdapter.prototype.initSiteDialog = function(langPair, attachBlockSelector, user, bookId, callback){
	var self = this;
	// chrome.runtime.sendMessage("eplepheahdinbfhnjjnkhkebfdhenbad", {
	// 	initDialog: {
	// 		langPair: langPair,
	// 		attachBlockSelector: attachBlockSelector,
	// 		user: user,
	// 		bookId: bookId
	// 	}
	// },
	// function(response) {
	// 	self.extensionIsActive = !!response;
	// 	callback();
	// });	
	chrome.runtime.sendMessage("cifbpdjhjkopeekabdgfjgmcbcgloioi", {
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
};