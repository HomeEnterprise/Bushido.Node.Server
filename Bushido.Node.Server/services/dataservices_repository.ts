/**
 * Created by seyaobey on 24-Nov-15.
 */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../codebase/servicecontext/dataservice.ts" />
/// <reference path="./user/userService.ts" />

import Services = require('./../codebase/servicecontext/dataservice');
import _ = require('lodash');
import user = require('./user/userService');

export interface ServiceInfo {
    serviceName: string,
    getServiceInstance(options:any):Services.DataService
}

var repository:Array<ServiceInfo> = [];

export var register_service = function(option: ServiceInfo){
    repository.push(option);

}

export var  get_service_instance = function (serviceName:string):Services.DataService {

    var info = _.find( repository, s => {
        return s.serviceName === serviceName;
    } );

    if(info){
        return info.getServiceInstance(null);
    }else{
        return null;
    }
}

var exec = (function(){

    register_service({
        serviceName:'userService',
        getServiceInstance: function(options:any){
            return new user.userService();
        }
    });

}());

