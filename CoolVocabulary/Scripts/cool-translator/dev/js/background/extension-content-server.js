'use strict';

import MessageTypes from '../message-types';


export default class ExtensionContentServer{
    _loadLangPair(){
        let langPair = null;
        if (localStorage.langPair){
            try{
                let obj = JSON.parse(localStorage.langPair)
                if(obj.sourceLang && obj.targetLang)
                    langPair = obj;
            }
            catch(e){
            }
        }
        return langPair ||
            {
                sourceLang: chrome.i18n.getUILanguage()==='en'?'es':'en',
                targetLang: chrome.i18n.getUILanguage()
            };
    }

    _saveLangPair(langPair){
        localStorage.langPair = JSON.stringify(langPair);
    }

    _onMessage(message, sender, callback){
        switch(message.type){
            case MessageTypes.LoadInitializationData:
                callback({
                    langPair: this._loadLangPair()
                });
                break;
            case MessageTypes.SaveLangPair:
                this._saveLangPair(message.langPair)
                break;
            default:
                console.error('Unknown message type:' + message.type);
                break;
        }
    }

    listen(){
        chrome.runtime.onMessage.addListener(this._onMessage.bind(this));
    }
}