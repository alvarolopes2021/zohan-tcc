const pg = require('pg');
const mysql = require('mysql2/promise');
const errorHandler = require('./../services/errors/errorHandler');
const { connectionStringSupabase } = require('./connection');

async function getAllRevenueFromIntervalOnlyDao(dateRange, res) {
    let method = "getAllRevenueFromIntervalOnlyDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT order_servicevalue, isabsent FROM datalogger_orders WHERE order_daytimeday BETWEEN $1 AND $2; "

        let params = [dateRange.start, dateRange.end];

        let response = await connection.query(sql, params);

        await connection.end();

        return response.rows;

    }
    catch(e){
        return errorHandler.handleError(e, method, res);
        return [];
    }
}

async function getRevenueFromIntervalAndBarberIdDao(revenueParams, res) {
    let method = "getRevenueFromIntervalAndBarberIdDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT order_servicevalue, isabsent FROM datalogger_orders WHERE order_barberid = $1 AND order_daytimeday BETWEEN $2 AND $3; "

        let params = [revenueParams.barberid, revenueParams.start, revenueParams.end];

        let response = await connection.query(sql, params);

        await connection.end();

        return response.rows;

    }
    catch(e){
        return errorHandler.handleError(e, method, res);
    }
}

module.exports = {
    getAllRevenueFromIntervalOnlyDao: getAllRevenueFromIntervalOnlyDao,
    getRevenueFromIntervalAndBarberIdDao: getRevenueFromIntervalAndBarberIdDao
}