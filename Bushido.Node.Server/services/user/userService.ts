/**
 * Created by seyaobey on 24-Nov-15.
 */

/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../codebase/servicecontext/dataservice.ts" />

import breeze = require('breeze-client');
import Services = require('../../codebase/servicecontext/dataservice');
import Q = require('q');
var Guid = require('guid');
import moment = require('moment');

//var debug = require('debug')('debug --> ');

interface loginOptions{
    email:string,
    password:string
}


export class userService extends Services.DataService{

    constructor(){
        super('user');
    }


    register(option: loginOptions): Q.IPromise<any> {

        var query = breeze.EntityQuery.from('user').where('email', 'equals', option.email);

        var d = Q.defer<any>();

        try {
            
            this.executeQuery(query).then(rst => {
                
                if (rst) {

                    if ( (<any>rst).length > 0) {
                        
                        return d.resolve({
                            success: false,
                            message: 'This is email is already taken'
                        });

                    }

                    this.dataManager.createEntity('user', {
                        id: Guid.raw(),
                        email: option.email,
                        password: option.password,
                        datecreated: moment( Date.now() )
                    });

                    this.saveChanges().then(rst => {

                        return d.resolve({
                            success: true,
                            message: 'You have successfully created an account'
                        });

                    }).catch(err => {

                        throw err;

                    });
                }
            });

        }catch (ex){
            
            d.reject(ex);

        }

        return d.promise;
    }



    login(options: loginOptions): Q.IPromise<Services.OutArgs> {

        var query = breeze.EntityQuery.from('user');//.where('email', 'equals', options.email);
            
        var pred = breeze.Predicate.create('email', 'equals', options.email)
            .and('password', 'equals', options.password);
        
        var d: Q.Deferred<Services.OutArgs> = Q.defer<Services.OutArgs>();

        this.executeQuery(query.where(pred)).then(rst => {

            var user_exists = rst.length > 0;

            if (user_exists) {
                delete rst[0]._$eref;
            }
            
            try {

                return d.resolve({
                    success: user_exists,
                    message: !user_exists ? 'email or password not found' : 'login successful',
                    data: user_exists ? rst[0] : {}
                });
            } catch (ex) {

                d.reject(ex);

            }
            
        }); 

        return d.promise;
    }
}

