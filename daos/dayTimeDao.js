require('dotenv').config();
const pg = require('pg');
const pgFormat = require('pg-format');

const mysql = require('mysql2/promise');

const errorHandler = require('../services/errors/errorHandler');
const constants = require('../constants');
const { connectionStringSupabase } = require('./connection');

async function insertSchedule(dayTimeModelList, res) {
    let method = "insertSchedule";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql =
            "INSERT INTO daytime (daytimeid, daytimeday, daytimestart, daytimeend, daytimepretty) VALUES %L";

        let values = [];
        dayTimeModelList.forEach(element => {

            values.push([element.daytimeid, element.daytimeday, element.daytimestart, element.daytimeend, element.daytimepretty]);
        });

        var response = connection.query(pgFormat(sql, values), [], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();
            if(res != null)
                return res.status(201).send(dayTimeModelList);
                
            return;
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return false;
    }
}

async function getSchedules(date, res) {
    let method = "getSchedules";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "SELECT daytimeid, daytimeday, daytimestart, daytimeend, daytimepretty FROM daytime WHERE daytimeday = $1;";

        connection.query(sql, [date], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            connection.end();
            if (queryResult.rows.length <= 0) {
                return res.status(404).send(constants.constants.ERRORS_TRANSLATED.DAY_NOT_INSERTED);
            }
            return res.status(200).send(queryResult.rows);
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return false;
    }
}

async function updateDayTime(dayTimeObject, res) {
    let method = "updateDayTime";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "UPDATE daytime SET daytimestart = $1, daytimeend = $2, daytimepretty = $3 WHERE daytimeid = $4;";

        connection.query(sql, [dayTimeObject.daytimestart, dayTimeObject.daytimeend, dayTimeObject.daytimepretty, dayTimeObject.daytimeid], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();
            return res.status(204).send({});
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return false;
    }
}

async function getAvailableDayTimeDao(barbertime_userid, date, res) {
    let method = "getAvailableDayTimeDao";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        /*
        let sql = "SELECT dt.daytimeid, dt.daytimeday, dt.daytimestart, dt.daytimeend, dt.daytimepretty FROM barber_time bt INNER JOIN daytime dt ON dt.daytimeid = bt.barbertime_daytimeid WHERE  ( ( barbertime_userid = $1 ) AND  ( barbertimeid NOT IN (select order_barbertimeid from orders  ) ) AND (dt.daytimeday = $2) ); ";*/

        sql = `SELECT dt.daytimeid, dt.daytimeday, dt.daytimestart, dt.daytimeend, dt.daytimepretty FROM barber_time bt 
        INNER JOIN daytime dt ON dt.daytimeid = bt.barbertime_daytimeid 
        WHERE ( 
            ( bt.barbertime_userid = $1 ) AND  
            ( bt.barbertimeid NOT IN (select order_barbertimeid from orders o ) AND bt.barbertime_userid = $2) AND
            (dt.daytimeday = $3)  AND 
            (dt.daytimestart - interval '40 minutes' NOT IN 
             (SELECT dt.daytimestart  FROM orders o INNER JOIN barber_time bt ON   
              bt.barbertimeid = o.order_barbertimeid INNER JOIN daytime dt 
              ON dt.daytimeid = bt.barbertime_daytimeid  WHERE 
              order_willusemoretime = True AND bt.barbertime_userid = $4 AND dt.daytimeday = $5 ) 
            )
        );	     `;

        connection.query(sql, [barbertime_userid, barbertime_userid, date, barbertime_userid, date], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();

            if (queryResult.rows.length <= 0) {
                return res.status(404).send(constants.constants.ERRORS_TRANSLATED.NO_AVAILABLE_SCHEDULE);
            }
            return res.status(200).send(queryResult.rows);
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return false;
    }
}

async function getAvailableDayTimeUsesMoreTimeDao(barbertime_userid, date, res) {
    let method = "getAvailableDayTimeUsesMoreTimeDao";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = `SELECT dt.daytimeid, dt.daytimeday, dt.daytimestart, dt.daytimeend, dt.daytimepretty FROM barber_time bt 
        INNER JOIN daytime dt ON dt.daytimeid = bt.barbertime_daytimeid 
        WHERE  ( 
            ( barbertime_userid =  $1 ) AND  
            ( barbertimeid NOT IN (select order_barbertimeid from orders) AND bt.barbertime_userid = $2) AND 
            (dt.daytimeday = $3) AND 	
            (dt.daytimestart + interval '40 minutes' NOT IN 
                 (SELECT dt.daytimestart  FROM orders o INNER JOIN barber_time bt ON   
                 bt.barbertimeid = o.order_barbertimeid INNER JOIN daytime dt 
                 ON dt.daytimeid = bt.barbertime_daytimeid WHERE 
                 bt.barbertime_userid = $4 AND dt.daytimeday = $5)
            )  AND
			(dt.daytimestart - interval '40 minutes' NOT IN 
             (SELECT dt.daytimestart  FROM orders o INNER JOIN barber_time bt ON   
              bt.barbertimeid = o.order_barbertimeid INNER JOIN daytime dt 
              ON dt.daytimeid = bt.barbertime_daytimeid  WHERE 
              order_willusemoretime = True AND bt.barbertime_userid = $6 AND dt.daytimeday = $7) 
            )	
        );  `;

        connection.query(sql, [barbertime_userid, barbertime_userid, date, barbertime_userid, date, barbertime_userid, date], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();

            if (queryResult.rows.length <= 0) {
                return res.status(404).send(constants.constants.ERRORS_TRANSLATED.NO_AVAILABLE_SCHEDULE);
            }
            return res.status(200).send(queryResult.rows);
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return false;
    }
}


async function getBarberAssignedTimeDao(barbertime_userid, date, res) {
    let method = "getBarberAssignedTimeDao";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "SELECT dt.daytimeid, dt.daytimeday, dt.daytimestart, dt.daytimeend, dt.daytimepretty FROM barber_time bt INNER JOIN daytime dt ON dt.daytimeid = bt.barbertime_daytimeid WHERE  ( barbertime_userid = $1 ) AND (dt.daytimeday = $2) ; ";

        connection.query(sql, [barbertime_userid, date], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();

            if (queryResult.rows.length <= 0) {
                return res.status(404).send(constants.constants.ERRORS_TRANSLATED.NO_AVAILABLE_SCHEDULE);
            }
            return res.status(200).send(queryResult.rows);
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return false;
    }
}

async function getDayTimeById(daytimeid, res) {
    let method = "getDayTimeById";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let values = [];

        let sql = "SELECT daytimeid, daytimeday, daytimestart, daytimeend, daytimepretty FROM daytime WHERE daytimeid = $1; ";

        values.push(daytimeid);

        let response = await connection.query(sql, values);

        await connection.end();

        return response;

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}

async function deleteAListOfDayTime(deletedList, res) {
    let method = "deleteAListOfDayTime";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let values = [];

        let sql = "DELETE FROM daytime WHERE TRUE AND ";
        sql += " daytimeid = $1 ";
        values.push(deletedList[0].daytimeid);

        deletedList.shift();

        deletedList.forEach((element) => {
            values.push(element.daytimeid);
            sql += " OR daytimeid = $" + values.length + " ";
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
        return false;
    }
}

module.exports = {
    insertSchedule: insertSchedule,
    updateDayTime: updateDayTime,
    getSchedules: getSchedules,
    deleteAListOfDayTime: deleteAListOfDayTime,
    getAvailableDayTimeDao: getAvailableDayTimeDao,
    getBarberAssignedTimeDao: getBarberAssignedTimeDao,
    getAvailableDayTimeUsesMoreTimeDao: getAvailableDayTimeUsesMoreTimeDao,
    getDayTimeById: getDayTimeById
}
