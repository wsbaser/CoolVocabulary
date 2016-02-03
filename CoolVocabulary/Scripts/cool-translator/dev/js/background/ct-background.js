'use strict';

import MessageTypes from '../message-types';
import ServiceProvider from './service-provider';
import ServicesServer from './services-server';
import PopupManager from './popup-manager';
import ExtensionContentServer from './extension-content-server';
import ExtensionExternalServer from './extension-external-server';

class CTBackground{
    constructor(){
        this.serviceProvider = new ServiceProvider();
        this.servicesServer = ServicesServer.create(this.servicesProvider.all);
        this.extensionContentServer = new ExtensionContentServer();
        this.extensionExternalServer = new ExtensionExternalServer(this.servicesProvider);
        this.popupManager = new PopupManager(this.servicesProvider);
    }

    run(){
        this.servicesServer.startListening();
        this.extensionContentServer.listen();
        this.extensionExternalServer.listen();
        this.popupManager.init();
        this.servicesProvider.cv.checkAuthentication();
    }
}

$.ajaxSetup({
    headers: {"X-Requested-With":"XMLHttpRequest"}
});