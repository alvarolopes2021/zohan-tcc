const mysql = require('mysql2/promise');
const pg = require('pg');
const { constants } = require('../constants');

const errorHandler = require('./../services/errors/errorHandler');
const { connectionStringSupabase } = require('./connection');

async function checkDatabaseversion() {
    let method = "checkDataBaseVersion";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT databaseversion FROM systemconfiguration;";

        let response = await connection.query(sql);

        await connection.end();

        if (response.rows[0] !== null && response.rows[0] !== undefined) {

            return response.rows[0];
        }
    }
    catch (e) {
        errorHandler.handleError(e, method, null);
        return null;
    }
}

async function updateSystemConfigurationTable() {
    let method = "updateSystemConfigurationTable";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "UPDATE systemconfiguration SET databaseversion = " + constants.SYSTEM.DATABASE_VERSION;

        connection.query(sql, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, null);
            }
            connection.end();
            return;
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, null);
    }
}

async function insertIntoSystemConfigurationTable() {
    let method = "insertIntoSystemConfigurationTable";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "INSERT INTO systemconfiguration (databaseversion) VALUES (" + constants.SYSTEM.DATABASE_VERSION + ")";

        connection.query(sql, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, null);
            }
            connection.end();
            return;
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, null);
    }
}

async function checkDatabaseversionOldDb() {
    let method = "checkDatabaseversionOldDb";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT databaseversion FROM systemconfiguration;";

        let response = await connection.query(sql);

        await connection.end();

        if (response.rows[0] !== null && response.rows[0] !== undefined) {

            return response.rows[0];
        }
    }
    catch (e) {
        errorHandler.handleError(e, method, null);
        return null;
    }
}

async function updateSystemConfigurationTableOldDb() {
    let method = "updateSystemConfigurationTableOldDb";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "UPDATE systemconfiguration SET databaseversion = " + constants.SYSTEM.DATABASE_VERSION;

        connection.query(sql, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, null);
            }
            connection.end();
            return;
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, null);
    }
}

module.exports = {
    checkDatabaseversion: checkDatabaseversion,
    checkDatabaseversionOldDb: checkDatabaseversionOldDb,
    updateSystemConfigurationTable: updateSystemConfigurationTable,
    updateSystemConfigurationTableOldDb: updateSystemConfigurationTableOldDb,
    insertIntoSystemConfigurationTable: insertIntoSystemConfigurationTable
}
