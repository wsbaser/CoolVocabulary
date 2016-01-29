window.DEBUG = false;
window.onload = function(){
	var connection = new ServicesConnection("services_connection");
	connection.open();
	var vocabulary = new Vocabulary(CVConfig(), connection);
	var loginForm = new LoginForm('#ctr_root');
	loginForm.show(vocabulary, function(){
		window.close();
	});

    var bgWindow = chrome.extension.getBackgroundPage();
    var cvService = bgWindow.Services.cv;
    var popupWindow = window;
	cvService.addEventListener('authend', function(){
		popupWindow.close();		
	});
};