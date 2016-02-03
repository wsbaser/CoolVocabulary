'use strict';

import MessageTypes from '../message-types';

export default class ExtensionExternalServer{
    constructor(servicesProvider){
        this.servicesProvider = servicesProvider;
    }

    _onMessage(request, sender, sendResponse){
        switch(request.type){
            case MessageTypes.Authenticate:
                // . set user data
                this.servicesProvider.cv.setUser(request.data.user, request.data.languages);
                // . request additional user data
                this.servicesProvider.cv.checkAuthentication(true);
                sendResponse(true);
                break;
            case MessageTypes.InitSiteDialog:
                chrome.tabs.sendMessage(sender.tab.id, {
                    type: MessageTypes.InitSiteDialog,
                    langPair: request.data.langPair,
                    attachBlockSelector: request.data.attachBlockSelector,
                    bookId: request.data.bookId
                });
                break;
            case MessageTypes.UpdateLanguageBooks:
                this.servicesProvider.cv.updateLanguageBooks(request.data.language, request.data.books);
                break;
            case MessageTypes.Logout:
                this.servicesProvider.cv.setUser(null);
                break;
            case MessageTypes.OAuthSuccess:
                // . send "oauthsuccess" message to all tabs
                chrome.tabs.query({}, function(tabs) {
                    tabs.forEach(function(tab){
                        chrome.tabs.sendMessage(tab.id, {
                            type: MessageTypes.OAuthSuccess,
                            user: request.data.user
                        });
                    });
                });
                this.servicesProvider.cv.setUser(request.data.user, request.data.languages);
                break;
        }
    }

    listen(){
        chrome.runtime.onMessageExternal.addListener(this._onMessage.bind(this));
    }
}