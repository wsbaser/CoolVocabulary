'use strict';

import '../../../styles/common.styl';
import '../../../styles/popup.styl';

import DEPopup from './de-popup';
import injectJQueryPlugins from 'jquery-plugins';

injectJQueryPlugins();

window.onload = function() {
    let dePopup = new DEPopup();
    let bgWindow = chrome.extension.getBackgroundPage();
    dePopup.show(bgWindow.ctBackground.servicesProvider.cv.user);
};