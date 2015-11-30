/**
 * Created by seyaobey on 22-Nov-15.
 */
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../datacontext/sequelize_context" />
/// <reference path="../datacontext/metadatastore.ts" />

import Q = require('q');
import  Sequelize = require('../datacontext/sequelize_context');
import metadastore = require('../datacontext/metadatastore');
import breeze = require('breeze-client');


export interface OutArgs {
    success: boolean,
    message: string,
    data?: any,
}


export class DataService {
    
    private entityName:string

    constructor(entityName: string){

        this.entityName = entityName;
    }

    private dm:breeze.EntityManager;
    public get dataManager(): breeze.EntityManager{

        if(!this.dm){
            this.dm = new breeze.EntityManager({
               dataService: new breeze.DataService(({
                   serviceName: 'BushidoSrv',
                   hasServerMetadata:false
               }))
            });
            this.dm.metadataStore.importMetadata( metadastore.DataStore.Store.exportMetadata() );
        }

        return this.dm;
    }


    private fill_datamanager(data:any[]){
        data.forEach(d =>{
           this.dataManager.createEntity(this.entityName, d, breeze.EntityState.Unchanged, breeze.MergeStrategy.OverwriteChanges)
        });
    }
    

    executeQuery(query: breeze.EntityQuery): Q.Promise<any[]>{

        var d = Q.defer<any[]>();

        Sequelize.executeQuery(query).then( rst =>{
            if(rst) {
                this.fill_datamanager(rst)
            }

            return d.resolve(rst);
        } );

        return d.promise;
    }


    saveChanges(): Q.Promise<any> {

        var saveBundle = this.dataManager.saveChanges();

        return <Q.Promise<any>>Sequelize.SaveChanges(saveBundle); 

    }
}
