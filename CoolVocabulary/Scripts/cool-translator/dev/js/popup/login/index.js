'use strict';

import '../../../styles/common.styl';
import '../../../styles/popup.styl';

import ServicesProvider from '../../content/service-provider';
import LoginForm from '../../controls/login-form';

window.onload = function(){
	var servicesProvider = new ServicesProvider();
	var vocabulary = servicesProvider.getVocabulary();

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