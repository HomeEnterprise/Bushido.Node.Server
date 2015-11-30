/// <reference path="../../typings/tsd.d.ts" />


import _ = require('lodash');
var Q = require('q');

var breezeSequelize = require('breeze-sequelize');

export var SequelizeManager = breezeSequelize.SequelizeManager;

export var SequelizeQuery = breezeSequelize.SequelizeQuery;

export var SequelizeSaveHandler = breezeSequelize.SequelizeSaveHandler;

export var breeze = breezeSequelize.breeze;

export var Instance_Manager = new SequelizeManager({
    dbName: 'BushidoDB',
    user: 'root',
    password: 'admin'
});


