const constants = require('./../constants');
const daoService = require('./../daos/daoServices');

const databaseVersion104 = require('../daos/databaseVersions/databaseVersion104');
const databaseVersion105 = require('../daos/databaseVersions/databaseVersion105');
const databaseVersion106 = require('../daos/databaseVersions/databaseVersion106');
const databaseVersion107 = require('../daos/databaseVersions/databaseVersion107');
const errorHandler = require('./errors/errorHandler');

async function onStartUp() {
    let method = "onStartup";

    let version = await daoService.checkDatabaseversion();

    // FIRST TIME

    if (version == undefined || version == null) {       

        //executes each function in the database version
        for (let i = 0; i < databaseVersion104.length; i++) {            
            await databaseVersion104[i].call();
            console.log(i); 
        }

        //executes each function in the database version
        for (let i = 0; i < databaseVersion105.length; i++) {            
            await databaseVersion105[i].call();
            console.log(i); 
        }

        //executes each function in the database version
        for (let i = 0; i < databaseVersion106.length; i++) {
            await databaseVersion106[i].call();
            console.log(i);
        }

        //executes each function in the database version
        for (let i = 0; i < databaseVersion107.length; i++) {
            await databaseVersion107[i].call();
            console.log(i);
        }

        daoService.insertIntoSystemConfigurationTable();
        
       return;
    }

    if (constants.constants.SYSTEM.DATABASE_VERSION === "104") {
        try {
            if (version !== null && version !== undefined) {

                version = version.databaseversion;

                if (version.toString() === constants.constants.SYSTEM.DATABASE_VERSION)
                    return;
            }
            //executes each function in the database version
            for (let i = 0; i < databaseVersion104.length; i++) {
                await databaseVersion104[i].call();
            }
            daoService.updateSystemConfigurationTable();
        }
        catch (e) {
            errorHandler.handleError(e, method, null);
        }
    }

    else if (constants.constants.SYSTEM.DATABASE_VERSION === "105") {
        try {
            if (version !== null && version !== undefined) {

                version = version.databaseversion;

                if (version.toString() === constants.constants.SYSTEM.DATABASE_VERSION)
                    return;
            }
            //executes each function in the database version
            for (let i = 0; i < databaseVersion105.length; i++) {
                await databaseVersion105[i].call();
            }
            daoService.updateSystemConfigurationTable();
        }
        catch (e) {
            errorHandler.handleError(e, method, null);
        }
    }

    else if (constants.constants.SYSTEM.DATABASE_VERSION === "106") {
        try {

            if (version !== null && version !== undefined) {

                version = version.databaseversion;

                if (version.toString() === constants.constants.SYSTEM.DATABASE_VERSION)
                    return;
            }
            //executes each function in the database version
            for (let i = 0; i < databaseVersion106.length; i++) {
                await databaseVersion106[i].call();
            }
            daoService.updateSystemConfigurationTable();
        }
        catch (e) {
            errorHandler.handleError(e, method, null);
        }
    }
    
    else if (constants.constants.SYSTEM.DATABASE_VERSION === "107") {
        try {

            if (version !== null && version !== undefined) {

                version = version.databaseversion;

                if (version.toString() === constants.constants.SYSTEM.DATABASE_VERSION)
                    return;
            }
            //executes each function in the database version
            for (let i = 0; i < databaseVersion107.length; i++) {
                await databaseVersion107[i].call();
            }
            daoService.updateSystemConfigurationTable();
        }
        catch (e) {
            errorHandler.handleError(e, method, null);
        }
    }
    

}

module.exports = {
    onStartUp: onStartUp
}