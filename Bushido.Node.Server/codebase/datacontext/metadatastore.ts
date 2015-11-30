﻿/// <reference path="../../typings/tsd.d.ts" />


var breeze_sequel = require('breeze-sequelize');

var breeze = breeze_sequel.breeze;
//import breeze = require('breeze-client');

var metadata = require('./metadata');

var DT = breeze.DataType;
var Identity = breeze.AutoGeneratedKeyType.Identity;
var Validator = breeze.Validator;
var camelCaseConvention = breeze.NamingConvention.none;

// Breeze Labs: breeze.metadata.helper.js
var helper = new breeze_sequel.breeze.config.MetadataHelper();

// Helper convenience methods
var addDataService = helper.addDataService.bind(helper);
var addTypeToStore = helper.addTypeToStore.bind(helper);
var setDefaultNamespace = helper.setDefaultNamespace.bind(helper);

var dataNameSpace = 'BushidoDB';

export module DataStore {

    interface DataProperty {
        [name: string]: DataPropertyDefinition
    }

    interface DataPropertyDefinition {
        dataType?: breeze.DataTypeSymbol;
        defaultValue?: any;
        isPartOfKey?: boolean;
        isUnmapped?: boolean;
        maxLength?: number;
    }


    interface EntityTypeDefinition {
        namespace: string;
        shortName: string;
        defaultResourceName: string,
        autoGeneratedKeyType: breeze.AutoGeneratedKeyType,

        dataProperties: DataProperty;
        complexProperties?: breeze.DataProperty[];
        unmappedProperties?: breeze.DataProperty[];
        validators?: breeze.Validator[];
    }

    export var Store: breeze.MetadataStore = new breeze.MetadataStore({ namingConvention: camelCaseConvention });

    addDataService(Store, 'DataStore');
    setDefaultNamespace('BushidoDB');


    function add_dataStore(typeDefinition: EntityTypeDefinition) {
        addTypeToStore(DataStore.Store, typeDefinition);
    }
    
    
    //1. User
    add_dataStore({
        namespace: dataNameSpace,
        shortName: 'user',
        defaultResourceName: 'user',
        autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            firstname: { maxLength: 4000 }, // DT.String is the default DataType
            lastname: { maxLength: 4000 },
            email: { maxLength: 4000 },
            password: { maxLength: 4000 },
            datecreated: { dataType: breeze.DataType.DateTime }
        }
    });

}