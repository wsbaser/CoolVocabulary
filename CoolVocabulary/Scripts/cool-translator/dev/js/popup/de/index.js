import DEPopup from './de-popup';

window.onload = function() {
    let dePopup = new DEPopup();
    let bgWindow = chrome.extension.getBackgroundPage();
    dePopup.show(bgWindow.ctBackground.servicesProvider.cv.user);
};