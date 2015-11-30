/**
 * Created by seyaobey on 22-Nov-15.
 */

/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../codebase/datacontext/sequelize_context.ts" />
/// <reference path="../codebase/servicecontext/dataservice.ts" />
/// <reference path="../services/dataservices_repository.ts" />
/// <reference path="../codebase/datacontext/metadatastore.ts" />
/// <referebce path="../services/dataservices_repository.ts" />


import Express = require('express');
import Sequelize = require("../codebase/datacontext/sequelize_context");
import breeze = require('breeze-client');
import Services = require('../codebase/servicecontext/dataservice');
import _ = require('lodash');
import metadastore = require('../codebase/datacontext/metadatastore');
import ServiceRepository = require('../services/dataservices_repository');

//var debug = require('debug')('debug --> ');


var express = require('express');
var router = express.Router();


function jsonpify(req: Express.Request, rs: any) {

    var _callback = req.query.callback;

    var response = _callback + '(' + JSON.stringify(rs) + ')';

    return response;

}




function get_serviceInstance(resourceName:string): Services.DataService{

  var serviceName = resourceName+'Service';

  var service = ServiceRepository.get_service_instance(serviceName);
    

  if(!service)
  {
    service = new Services.DataService(resourceName);
  }

  return service;
}


router.post('/process/:resource/:operation', function(req: Express.Request, res: Express.Response, next){

    var resourceName = req.params.resource;
    var operation = req.params.operation;
    
    var service = get_serviceInstance(resourceName);
    
    try {
        
        var promise: Q.Promise<any> =service[operation](req.body);

        promise.then(rst => {

            if(!rst){

                rst = {
                    success: true,
                    message: 'null'
                }
            }
            
            res.send( rst );

        }).catch(ex =>{
            
            next(ex);
        });

    }catch (ex)
    {
        next(ex);
    }

});



router.get('/query/Metadata/', function(req: Express.Request, res: Express.Response, next) {

  try {

    var metadata = metadastore.DataStore.Store.exportMetadata();

    res.send( metadata);

  }catch (ex)
  {
    next(ex);
  }

});



router.post('/query/:resource', function(req: Express.Request, res: Express.Response, next) {

  var service = get_serviceInstance(req.params.resource);

  service.executeQuery(req.body).then( rst =>{

    var data = _.map( <any>rst , d =>{

      delete  (<any>d)._$eref;

      return d;
    });

    res.send(data);

  } ).catch( err =>{

    next(err);
  });

});



module.exports = router;