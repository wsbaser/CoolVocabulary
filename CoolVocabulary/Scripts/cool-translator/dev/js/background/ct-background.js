'use strict';

import MessageTypes from '../message-types';
import ServiceProvider from './service-provider';
import ServicesServer from './services-server';
import PopupManager from './popup-manager';
import ExtensionContentServer from './extension-content-server';
import ExtensionExternalServer from './extension-external-server';

export default class CTBackground{
    constructor(){
        this.serviceProvider = new ServiceProvider();
        this.servicesServer = ServicesServer.create(this.serviceProvider.all);
        this.extensionContentServer = new ExtensionContentServer();
        this.extensionExternalServer = new ExtensionExternalServer(this.serviceProvider);
        this.popupManager = new PopupManager(this.serviceProvider);
    }

    run(){
        this.servicesServer.listen();
        this.extensionContentServer.listen();
        this.extensionExternalServer.listen();
        this.popupManager.init();
        this.serviceProvider.cv.checkAuthentication();
    }
}