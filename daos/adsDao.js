const pg = require('pg');
const mysql = require('mysql2/promise');
const errorHandler = require('./../services/errors/errorHandler');
const { connectionStringSupabase } = require('./connection');

async function insertAds(ad, res) {
    let method = "insertAds";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        connection.query("TRUNCATE TABLE ads", (err1, query1) => {
            if (err1) {
                connection.end();
                return errorHandler.handleError(err1, method, res);
            }

            let sql = "INSERT INTO ads (adid, addescription) VALUES ($1,$2);";

            let values = [];
            values.push(ad.adid);
            values.push(ad.addescription);

            connection.query(sql, values, (err2, query2) => {
                if (err2) {
                    connection.end();
                    return errorHandler.handleError(err2, method, res);
                }
                connection.end();
                return res.status(200).send({});
            });
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getAds(res) {
    let method = "getAds";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "SELECT adid, addescription FROM ads;";

        connection.query(sql, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();
            return res.status(200).send(queryResult.rows[0]);
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

module.exports = {
    insertAds: insertAds,
    getAds: getAds
}
