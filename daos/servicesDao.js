const pg = require('pg');
const pgFormat = require('pg-format');

const mysql = require('mysql2/promise');

const errorHandler = require('./../services/errors/errorHandler');
const { connectionStringSupabase } = require('./connection');

async function insertServices(servicesModelList, res) {
    let method = "insertServices";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "INSERT INTO services (serviceid, servicedescription, servicevalue) VALUES %L";

        let array = Array.from(servicesModelList);

        let values = [];

        array.forEach((element) => {
            values.push([element.serviceid, element.servicedescription, element.servicevalue]);
        });

        connection.query(pgFormat(sql, values), [], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();
            return res.status(200).send(servicesModelList);
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getServices(res) {
    let method = "getServices";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "SELECT serviceid, servicedescription, servicevalue, usesmoretime FROM services;";

        connection.query(sql, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(e, method, res);
            }
            connection.end();
            return res.status(200).send(queryResult.rows);
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function deleteListServices(serviceids, res) {
    let method = "deleteListServices";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let values = [];
        let sql = "DELETE FROM services WHERE TRUE AND ";
        sql += " serviceid = $1";
        values.push(serviceids[0]);

        serviceids.shift();

        serviceids.forEach((element) => {
            values.push(element);
            sql += " OR serviceid = $" + values.length + " ";
        });
        sql += ";";

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();
            return res.status(200).send({});
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function updateServiceDao(serviceModel, res) {
    let method = "updateServiceDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);
        connection.connect();

        let sql = "UPDATE services SET servicedescription = $1, servicevalue = $2, usesmoretime = $3 WHERE serviceid = $4;";

        let values = [serviceModel.servicedescription, serviceModel.servicevalue, serviceModel.usesmoretime, serviceModel.serviceid];

        sql += ";";

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(e, method, res);
            }
            connection.end();
            return res.status(200).send({});
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

//added v4.0.0
async function getServiceById(serviceid, res) {
    const method = 'getServiceById';
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT serviceid, servicedescription, servicevalue, usesmoretime FROM services WHERE serviceid = $1;";

        let response = await connection.query(sql, [serviceid]);

        if (response.rowCount <= 0) {
            await connection.end();
            return [];
        }
        
        return response.rows;
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}


module.exports = {
    insertServices: insertServices,
    getServices: getServices,
    deleteListServices: deleteListServices,
    updateServiceDao: updateServiceDao,
    getServiceById: getServiceById
}
