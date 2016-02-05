'use strict';

export default class PopupManager{
    constructor(servicesProvider){
        this.servicesProvider = servicesProvider;
    }
 
    _updateBadge(){
        let user = this.servicesProvider.cv.user;
        if(user){
            chrome.browserAction.setPopup({popup:'popup_de.html'});
            if(user.hasUncompletedDE){
                chrome.browserAction.setBadgeText({text:'>'});
            }else{
                chrome.browserAction.setBadgeText({text:''});
            }
        }
        else{
            chrome.browserAction.setPopup({popup:'popup_login.html'});
            chrome.browserAction.setBadgeText({text:''});
        }
    }

    init(){
        this.servicesProvider.cv.addAuthEndListener(this._updateBadge.bind(this));
        this.servicesProvider.cv.addUserDataUpdatedListener(this._updateBadge.bind(this));
    }
}