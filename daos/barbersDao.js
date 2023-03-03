const pg = require('pg');

const errorHandler = require('./../services/errors/errorHandler');
const constants = require('./../constants');
const { connectionStringSupabase } = require('./connection');

async function getAllBarbersDao(res) {
    const method = "getAllBarbersDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "SELECT userid, username, userphone FROM users WHERE usertype = '" +
            constants.constants.ROLES.BARBER + "' ;";

        connection.query(sql, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();
            if(res != null)
                return res.status(200).send(queryResult.rows);
                
            return queryResult.rows;
        })
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

//added v4.5.0
async function getAllBarbersDaoAwaitable(res) {
    const method = "getAllBarbersDaoAwaitable";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT userid, username, userphone FROM users WHERE usertype = '" +
            constants.constants.ROLES.BARBER + "' ;";

        var response = await connection.query(sql);

        await connection.end();

        return response.rows;
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}


async function deleteListOfBarberDao(listBarberId, res) {
    const method = "deleteListOfBarberDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "DELETE FROM users WHERE TRUE AND usertype = $1 AND ";
        sql += " userid = $2 ";

        let values = [];

        values.push(constants.constants.ROLES.BARBER);

        values.push(listBarberId[0]);
        listBarberId.shift();

        listBarberId.forEach((element) => {
            values.push(element);
            sql += " OR userid = $" + values.length.toString() + " ";
        });

        sql += ";";

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            connection.end();

            res.status(200).send({})
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}


module.exports = {
    getAllBarbersDao: getAllBarbersDao,
    deleteListOfBarberDao: deleteListOfBarberDao,
    getAllBarbersDaoAwaitable: getAllBarbersDaoAwaitable
}