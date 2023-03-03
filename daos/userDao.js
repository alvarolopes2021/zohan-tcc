require('dotenv').config();
const pg = require('pg');

//const mysql = require('mysql2/promise');

const { User } = require('../models/userModel');
const errorHandler = require('../services/errors/errorHandler');
const constants = require('../constants');
const { connectionStringSupabase } = require('./connection');
//const ordersDao = require('../daos/ordersDao');


async function createUser(user, res) {
    let method = 'createUser';

    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        var response = await connection.query('INSERT INTO users (userid, username, useremail, userphone, userpsw, usertype) VALUES ($1,$2,$3,$4,$5,$6);', [user.userid, user.username, user.useremail, user.userphone, user.userpsw, user.usertype]);

        await connection.end();

        return true;

    }
    catch (exception) {
        errorHandler.handleError(exception, method, res);
        return false;
    }
}

// returns 1 user
async function getUserByCriteria(criteria, user, res) {

    let method = "getUserByCriteria";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let params = [];

        let sql = "SELECT userid, username, useremail, userphone, userpsw, usertype FROM users WHERE TRUE ";

        if (criteria.includes(constants.constants.CRITERIAS.ID)) {
            params.push(user.userid);
            sql = sql + 'AND userid = $' + params.length.toString() + " ";
        }
        if (criteria.includes(constants.constants.CRITERIAS.EMAIL)) {
            params.push(user.useremail);
            sql = sql + 'AND useremail = $' + params.length.toString() + " ";

        }
        if (criteria.includes(constants.constants.CRITERIAS.PHONE)) {
            params.push(user.userphone);
            sql = sql + 'AND userphone = $' + params.length.toString() + " ";
        }
        if (criteria.includes(constants.constants.CRITERIAS.PSW)) {
            params.push(user.userpsw);
            sql = sql + 'AND userpsw = $' + params.length.toString() + " ";
        }
        if (criteria.includes(constants.constants.CRITERIAS.ROLE)) {
            params.push(user.usertype);
            sql = sql + 'AND usertype = $' + params.length.toString() + " ";
        }
        sql += ";";

        var response = await connection.query(sql, params);

        await connection.end();

        return response.rows;

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}

// returns 1 user
async function getUserByCriteriaV2(criteria, user, res) {

    let method = "getUserByCriteriaV2";

    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let params = [];

        let sql = "SELECT userid, username, useremail, userphone, userpsw, usertype, pushsubscription FROM users WHERE TRUE ";

        if (criteria.includes(constants.constants.CRITERIAS.ID)) {
            params.push(user.userid);
            sql = sql + 'AND userid = $' + params.length.toString() + " ";
        }
        if (criteria.includes(constants.constants.CRITERIAS.EMAIL)) {
            params.push(user.useremail);
            sql = sql + 'AND useremail = $' + params.length.toString() + " ";

        }
        if (criteria.includes(constants.constants.CRITERIAS.PHONE)) {
            params.push(user.userphone);
            sql = sql + 'AND userphone = $' + params.length.toString() + " ";
        }
        if (criteria.includes(constants.constants.CRITERIAS.PSW)) {
            params.push(user.userpsw);
            sql = sql + 'AND userpsw = $' + params.length.toString() + " ";
        }
        if (criteria.includes(constants.constants.CRITERIAS.ROLE)) {
            params.push(user.usertype);
            sql = sql + 'AND usertype = $' + params.length.toString() + " ";
        }
        sql += ";";

        var response = await connection.query(sql, params);

        await connection.end();

        return response.rows;

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}

async function getAllUsers(res) {
    let method = "getAllUsers";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "SELECT username, useremail, userphone, usertype FROM users";

        connection.query(sql, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            connection.end();
            return res.status(200).send(queryResult.rows);
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function updateUserDao(userModel, res) {
    let method = "updateUserDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "UPDATE users SET username = $1, useremail = $2, userphone = $3 WHERE userid = $4";

        let values =
            [userModel.username, userModel.useremail, userModel.userphone, userModel.userid];

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            connection.end();
            return res.status(200).send({username: userModel.username});
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function updateUserPsw(userModel, res) {
    let method = "updateUserPsw";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "UPDATE users SET userpsw = $1 WHERE userid = $2";

        let values = [userModel.userpsw, userModel.userid];

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            connection.end();
            return;
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

// added v3.0.0
async function deleteAccountDao(user, res) {
    let method = "deleteAccountDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        // WHEN DELETING AN USER, AS WE ARE NOT USING RELATIONSHIP WITH USER TABLE IN ORDERS TABLE, WE CHECK IF THERE IS ANY NEW SCHEDULED ORDER FOR THIS USER

        // IF THERE IS A NEW ORDER FOR THE USER DELTING ACCOUNT, WE REMOVE THESE ORDERS

        const {deleteListOfOrderDao} = require('../daos/ordersDao');
        
        let sql = `SELECT 
            orderid, order_daytimeday, order_daytimestart FROM datalogger_orders 
            WHERE order_userid = $1 AND 
            (
                (order_daytimeday)::date >= ( (current_date - interval '3 hour') AT TIME ZONE 'America/Sao_Paulo')::date
            ) AND 
            ( 
                (order_daytimestart)::time >= (current_time AT TIME ZONE 'America/Sao_Paulo' ) 
                ); `;

        let values = [user.userid];

        let response = await connection.query(sql, values);

        let now = new Date(new Date().getTime() - 3 * 60 * 60 * 1000).toLocaleTimeString()

        if (response.rows.length > 0) {
            deleteListOfOrderDao(response.rows.map((value) => value.orderid), res, true);
        }

        sql = "DELETE FROM users WHERE userid = $1 ;";

        values = [user.userid];

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            connection.end();

            res.status(204).send({});

            return;
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return;
    }
}

//added v3.7.0
async function getAllUsersAwaitable(res) {
    let method = "getAllUsersAwaitable";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT userid, username, useremail, userphone, usertype, pushsubscription FROM users";

        let response = await connection.query(sql);

        await connection.end();

        return response.rows;

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}

async function insertPushSubscriptionDao(userModel, res) {
    const method = "insertPushSubscriptionDao";

    try {

        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = "UPDATE users SET pushsubscription = $1 WHERE userid = $2";

        let values = [userModel.pushsubscription, userModel.userid];

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            connection.end();
            return;
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return;
    }
}


module.exports = {
    createUser: createUser,
    getUserByCriteria: getUserByCriteria,
    getAllUsers: getAllUsers,
    updateUserDao: updateUserDao,
    updateUserPsw: updateUserPsw,
    deleteAccountDao: deleteAccountDao,
    insertPushSubscriptionDao: insertPushSubscriptionDao,
    getAllUsersAwaitableDao: getAllUsersAwaitable,
    getUserByCriteriaV2: getUserByCriteriaV2
}
