'use strict';

import DictionaryProvider from '../common/dictionary-provider';

export default class CVProvider extends DictionaryProvider {
    constructor(config){
        super(config);
    }
    
    _rejectUnauthorized(deferred, xhr) {
        var response = JSON.parse(xhr.getResponseHeader("X-Responded-JSON"));
        if (response && response.status == 401) {
            deferred.reject({
                notAuthenticated: true
            });
            return true;
        }
        return false;
    }

    getBooks() {
        var self = this;
        var deferred = $.Deferred();
        $.post(this.config.ajax.getBooks).done(function(data, status, xhr) {
                if (self._rejectUnauthorized(deferred, xhr))
                    return;
                if (data.error_msg)
                    deferred.reject(data.error_msg);
                else
                    deferred.resolve(data.vocabularies);
            })
            .fail(function(xhr) {
                self.rejectWithResponseText(deferred, xhr);
            });
        return deferred.promise();
    }

    checkAuthentication() {
        var self = this;
        var deferred = $.Deferred();
        $.post(this.config.ajax.checkAuthentication).done(function(data) {
            if (data.error_msg)
                deferred.reject(data.error_msg);
            else
                deferred.resolve(data);
        }).fail(function(xhr) {
            self.rejectWithResponseText(deferred, xhr);
        });
        return deferred.promise();
    }

    login(username, pass) {
        var self = this;
        var deferred = $.Deferred();
        $.post(this.config.ajax.login, {
            email: username,
            password: pass
        }).done(function(data) {
            if (data.error_msg)
                deferred.reject(data.error_msg);
            else
                deferred.resolve(data);
        }).fail(function(xhr) {
            self.rejectWithResponseText(deferred, xhr);
        });
        return deferred.promise();
    }

    addTranslation(data) {
        var self = this;
        var deferred = $.Deferred();
        $.ajax(this.config.ajax.addTranslation, {
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(data),
            error: function(xhr) {
                self.rejectWithResponseText(deferred, xhr);
            },
            success: function(data, status, xhr) {
                if (self._rejectUnauthorized(deferred, xhr))
                    return;
                if (data.error_msg)
                    deferred.reject(data.error_msg);
                else
                    deferred.resolve(data);
            }
        });
        return deferred.promise();
    }
}