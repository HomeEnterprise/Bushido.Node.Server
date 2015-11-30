/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="metadatastore.ts" />

import  Express = require('express');
import sequelize = require('./breeze_sequelize');
import breeze = require('breeze-client');
import Q = require('q');
import metastore = require('./metadatastore');
var ajax = require('./ajax_adapter');

breeze.config.initializeAdapterInstance('ajax', 'bushido_ajax', true);

sequelize.Instance_Manager.importMetadata(metastore.DataStore.Store.exportMetadata());


export var executeQuery = function (query: breeze.EntityQuery): any {

    var src_query = new sequelize.breeze.EntityQuery(query);

    var exec_query = new sequelize.SequelizeQuery(sequelize.Instance_Manager, src_query);

    var d = Q.defer();

    exec_query.execute().then( rst =>
    {
        return d.resolve( rst );
    });

    return d.promise;
}


export var SaveChanges = function (SaveBundle):Q.IPromise<any> {

    return sequelize.SequelizeSaveHandler.save(sequelize.Instance_Manager, {
        body: {
            entities: JSON.parse(SaveBundle).entities,
        }
    });

}