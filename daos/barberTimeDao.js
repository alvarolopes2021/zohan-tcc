require('dotenv').config();
const pg = require('pg');
const pgFormat = require('pg-format');

const { constants } = require('../constants');


const errorHandler = require('./../services/errors/errorHandler');
const { connectionStringSupabase } = require('./connection');

async function insertBarberTimeDao(data, res = null) {
    const method = "insertBarberTimeDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql =
            "INSERT INTO barber_time (barbertimeid, barbertime_userid, barbertime_daytimeid) VALUES %L";

        connection.query(pgFormat(sql, data), [], (err, queryResult) => {
            try{
                if(err){
                    connection.end();
                    return errorHandler.handleError(err, method, res);
                }

                connection.end();
                return res.status(201).send({});
            }
            catch(e){
                return errorHandler.handleError(err, method, res);
            }
        })
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}


async function removeAssignmentDao(data, res = null) {
    const method = "removeAssignmentDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        data.shift();

        let sql =
            "DELETE FROM barber_time WHERE barbertime_userid = $1 AND barbertime_daytimeid = $2";

        connection.query(sql, data, (err, queryResult) => {
            try{
                if(err){
                    connection.end();
                    return errorHandler.handleError(err, method, res);
                }

                connection.end();
                return res.status(201).send({});
            }
            catch(e){
                return errorHandler.handleError(err, method, res);
            }
        })
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getBarberTimeByCriteriaDao(criteria, data, res = null) {
    const method = "getBarberTimeByCriteriaDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        data.shift(); //removes empty barbertimeid from data model

        let sql = "SELECT barbertimeid FROM barber_time WHERE TRUE AND ";

        let params = [];

        if(criteria.includes(constants.CRITERIAS.USER_ID)){
            params.push(data[0]);
            sql += " barbertime_userid = $" + params.length.toString() + " ";
        }
        if(criteria.includes(constants.CRITERIAS.DAY_TIME_ID)){
            params.push(data[1]);
            sql += "AND barbertime_daytimeid = $" + params.length.toString() + " ";
        }            
        
        sql += ";";

        let response = await connection.query(sql, params);

        await connection.end()

        return response.rows[0];

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getBarberTimeWithNameByBarbertimeId(barbertimeid, res = null) {
    const method = "getBarberTimeWithNameByBarbertimeId";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT u.username, bt.barbertimeid, bt.barbertime_userid, bt.barbertime_daytimeid FROM barber_time bt INNER JOIN users u ON u.userid = bt.barbertime_userid WHERE bt.barbertimeid = $1 ;";         

        let params = [];
        params.push(barbertimeid);

        let response = await connection.query(sql, params);

        await connection.end()

        return response.rows;

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

module.exports = {
    insertBarberTimeDao: insertBarberTimeDao,
    removeAssignmentDao: removeAssignmentDao,
    getBarberTimeByCriteriaDao: getBarberTimeByCriteriaDao,
    getBarberTimeWithNameByBarbertimeId: getBarberTimeWithNameByBarbertimeId
}