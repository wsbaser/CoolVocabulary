'use strict';

import '../../../styles/common.styl';
import '../../../styles/popup.styl';

import CVConfig from '../../services/cv/config';
import LoginForm from '../../controls/login-form';
import injectJQueryPlugins from 'jquery-plugins';
import ServicesConnection from '../../services/services-connection';
import Vocabulary from '../../services/vocabulary';

injectJQueryPlugins();

window.onload = function(){
    let connection = new ServicesConnection("services_connection");
    connection.open();
    let vocabulary = new Vocabulary(CVConfig, connection);

    var popupWindow = window;
	var loginForm = new LoginForm('#ctr_root');
	loginForm.show(vocabulary, function(){
		popupWindow.close();
	});

    var bgWindow = chrome.extension.getBackgroundPage();
    var cvService = bgWindow.ctBackground.servicesProvider.cv;
	cvService.addEventListener('authend', function(){
		popupWindow.close();		
	});
};