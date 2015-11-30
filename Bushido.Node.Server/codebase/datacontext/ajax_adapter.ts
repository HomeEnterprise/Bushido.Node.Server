/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="sequelize_context.ts" />


import Context = require('./sequelize_context');
import Q = require('q');

(function (factory) {
    
    var breezeSequelize = require('breeze-sequelize');    
    module.exports = factory(breezeSequelize.breeze);
    
} (function (breeze) {

        "use strict";
        var core = breeze.core;

        var jQuery;

        var ctor = function AjaxJQueryAdapter() {
            this.name = "bushido_ajax";
            this.defaultSettings = {};
            this.requestInterceptor = null;
        };
        var proto = ctor.prototype;

        proto.initialize = function () {
            // look for the jQuery lib but don't fail immediately if not found
            jQuery = core.requireLib("jQuery");
        };

        proto.ajax = function (config): Q.Promise<any> {

            var d = Q.defer<any>();

            var $data = config.params || config.data;

            if (config.url == 'BushidoSrv/SaveChanges') {

                return <Q.Promise<any>>Context.SaveChanges($data).then(rst => {

                    return d.resolve(rst);

                });

                //ContextExecution.SaveChanges(config.params || config.data);
            }
            
            Context.executeQuery($data).then(rst => {
                
                return d.resolve(rst);
                
            }).catch(err => {

                d.reject(err);
                
            }); 

            return d.promise;
        };

        function getHeadersFn(jqXHR) {
            if (jqXHR.status === 0) { // timeout or abort; no headers
                return function (headerName) {
                    return (headerName && headerName.length > 0) ? "" : {};
                };
            } else { // jqXHR should have header functions
                return function (headerName) {
                    return (headerName && headerName.length > 0) ?
                        jqXHR.getResponseHeader(headerName) :
                        jqXHR.getAllResponseHeaders();
                };
            }
        }


        breeze.config.registerAdapter("ajax", ctor); 
        

        return ctor;       

}));