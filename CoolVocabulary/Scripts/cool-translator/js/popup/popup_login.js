window.DEBUG = true;
window.onload = function(){
	var connection = new ServicesConnection("services_connection");
		connection.open();
		var vocabulary = new Vocabulary(CVConfig(), connection);
	var loginForm = new LoginForm('#ctr_root');
	loginForm.show(vocabulary);
};
