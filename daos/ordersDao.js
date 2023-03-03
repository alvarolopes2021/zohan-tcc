require('dotenv').config();

//const mysql = require('mysql2/promise');

/* const mongoose = require('mongoose');
const { OrdersSchemaModel } = require('../models/ordersModel');
*/

const pg = require('pg');

const errorHandler = require('./../services/errors/errorHandler');
const constants = require('./../constants');

const userDao = require('../daos/userDao');
const { User } = require('../models/userModel');
const daytimeDao = require('../daos/dayTimeDao');
const barbertimeDao = require('../daos/barberTimeDao');
const serviceDao = require('../daos/servicesDao');
const { connectionStringSupabase } = require('./connection');


async function createOrder(order, res) {
    let method = "createOrder";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        //await mongoose.connect(process.env.MONGODB_STRING);

        connection.connect();

        let criteria = [constants.constants.CRITERIAS.ID];

        let user = new User();
        user.userid = order.order_userid;

        let userResponse = await userDao.getUserByCriteria(criteria, user, res);

        if (userResponse.length <= 0) {
            //mongoose.disconnect();
            connection.end();
            return res.status(404).send(constants.constants.ERRORS_TRANSLATED.USER_NOT_FOUND);
        }

        let barbertimeResponse = await barbertimeDao.getBarberTimeWithNameByBarbertimeId(order.order_barbertimeid, res);

        if (barbertimeResponse.length <= 0) {
            //mongoose.disconnect();
            connection.end();
            return res.status(404).send(constants.constants.ERRORS_TRANSLATED.BARBER_NOT_FOUND);
        }

        let daytimeResponse = await daytimeDao.getDayTimeById(barbertimeResponse[0].barbertime_daytimeid);

        if (daytimeResponse.length <= 0) {
            //mongoose.disconnect();
            connection.end();
            return res.status(404).send(constants.constants.ERRORS_TRANSLATED.BARBER_NOT_FOUND);
        }

        let serviceResponse = await serviceDao.getServiceById(order.order_serviceid, res);

        if (serviceResponse.length <= 0) {
            //mongoose.disconnect();
            connection.end();
            return res.status(404).send(constants.constants.ERRORS_TRANSLATED.SERVICE_NOT_FOUND);
        }

        /*let newOrder = new OrdersSchemaModel({
            orderid: order.orderid,
            order_userid: order.order_userid,
            order_username: userResponse[0].username,
            order_userphone: userResponse[0].userphone,

            order_barbername: barbertimeResponse[0].username,

            order_daytimeid: daytimeResponse.rows[0].daytimeid,
            order_daytimeday: daytimeResponse.rows[0].daytimeday,
            order_daytimestart: daytimeResponse.rows[0].daytimestart,
            order_daytimeend: daytimeResponse.rows[0].daytimeend,
            order_daytimepretty: daytimeResponse.rows[0].daytimepretty,

            order_barbertimeid: order.order_barbertimeid,

            order_servicedescription: order.order_servicedescription,
            order_servicevalue: order.order_servicevalue,
            order_willusemoretime: order.order_willusemoretime,

        });

        newOrder.save().then(value => {
            mongoose.disconnect();
        }).catch(err => {
            mongoose.disconnect();
            errorHandler.handleError(err, method, res);
        });
        */

        sql =
            "INSERT INTO orders (orderid, order_userid, order_barbertimeid, order_serviceid, order_willusemoretime) VALUES ($1,$2,$3,$4,$5)";

        connection.query(sql, [order.orderid, order.order_userid, order.order_barbertimeid, order.order_serviceid, order.order_willusemoretime], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            sql = "INSERT INTO datalogger_orders (orderid, order_userid, order_username, order_userphone, order_barberid, order_barbertimeid, order_barbername, order_daytimeid, order_daytimeday, order_daytimestart, order_daytimeend, order_daytimepretty, order_servicedescription, order_servicevalue, order_willusemoretime) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15);";

            let values = [
                order.orderid,
                order.order_userid,
                userResponse[0].username,
                userResponse[0].userphone,
                barbertimeResponse[0].barbertime_userid,
                order.order_barbertimeid,
                barbertimeResponse[0].username,
                daytimeResponse.rows[0].daytimeid,
                daytimeResponse.rows[0].daytimeday,
                daytimeResponse.rows[0].daytimestart,
                daytimeResponse.rows[0].daytimeend,
                daytimeResponse.rows[0].daytimepretty,
                serviceResponse[0].servicedescription,
                serviceResponse[0].servicevalue,
                order.order_willusemoretime
            ];

            connection.query(sql, values, (err2, queryResult2) => {
                if (err) {
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

// getOrdersByCriteria
// MongoDB
/*async function getOrdersByCriteria(criteria, order, res) {
    let method = "getOrdersByCriteria";
    try {

        mongoose.connect(process.env.MONGODB_STRING).then(connection => {

            let query = {};

            if (criteria.includes(constants.constants.CRITERIAS.ID)) {
                query.orderid = order.orderid;
            }

            else if (criteria.includes(constants.constants.CRITERIAS.ORDER_USER_ID)) {
                query.order_userid = order.order_userid;
            }

            else if (criteria.includes(constants.constants.CRITERIAS.DAY_TIME_ID)) {
                query.order_daytimeday = order.order_daytimeid;
            }

            else if (criteria.includes(constants.constants.CRITERIAS.ORDER_SERVICE_ID)) {
                query.order_serviceid = order.order_serviceid;
            }

            OrdersSchemaModel.find(query).then(value => {
                if (res != null) {
                    mongoose.disconnect();
                    return res.status(200).send(value);
                }
                mongoose.disconnect();
                return value;
            });

        }).catch(err => {
            return errorHandler.handleError(err, method, res);
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}
*/

//PostgreSQL 
//getOrdersByCriteria()
async function getOrdersByCriteria(criteria, order, res) {
    let method = "getOrdersByCriteria";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let values = [];

        let sql = `
            SELECT orderid, order_username, order_userphone, order_barbername, order_daytimeday, order_daytimestart, order_daytimepretty, order_servicedescription, order_servicevalue, order_willusemoretime, isabsent FROM datalogger_orders WHERE TRUE 
        `;

        if (criteria.includes(constants.constants.CRITERIAS.ID)) {
            values.push(order.orderid);
            sql += " AND orderid = $" + values.length.toString() + " ";

        }

        if (criteria.includes(constants.constants.CRITERIAS.ORDER_USER_ID)) {
            values.push(order.order_userid);
            sql += " AND order_userid = $" + values.length.toString() + " ";
        }

        if (criteria.includes(constants.constants.CRITERIAS.DAY_TIME_ID)) {
            values.push(order.order_daytimeid);
            sql += " AND order_daytimeid = $" + values.length.toString() + " ";
        }

        if (criteria.includes(constants.constants.CRITERIAS.ORDER_SERVICE_ID)) {
            values.push(order.order_serverid);
            sql += " AND order_serviceid = $" + values.length.toString() + " ";
        }

        sql += ";";

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            connection.end();
            if (res != null)
                return res.status(200).send(queryResult.rows);

            return queryResult.rows;

        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}
//end 

//added v400
// MongoDB
/*async function getOrdersByCriteriaAwaitable(criteria, order, res) {
    let method = "getOrdersByCriteriaAwaitable";
    try {

        try {
            await mongoose.connect(process.env.MONGODB_STRING);
        }
        catch (err) {
            if (res != null) {
                await mongoose.disconnect();
                return res.status(200).send(response);
            }

            await mongoose.disconnect();
            return;
        }

        let query = {};

        if (criteria.includes(constants.constants.CRITERIAS.ID)) {
            query.orderid = order.orderid;
        }

        else if (criteria.includes(constants.constants.CRITERIAS.ORDER_USER_ID)) {
            query.order_userid = order.order_userid;
        }

        else if (criteria.includes(constants.constants.CRITERIAS.DAY_TIME_ID)) {
            query.order_daytimeday = order.order_daytimeid;
        }

        else if (criteria.includes(constants.constants.CRITERIAS.ORDER_SERVICE_ID)) {
            query.order_serviceid = order.order_serviceid;
        }

        let response = await OrdersSchemaModel.find(query);

        if (res != null) {
            await mongoose.disconnect();
            return res.status(200).send(response);
        }

        await mongoose.disconnect();
        return response;

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}
*/

//added v3.7.0
// PostgreSQL 
//getOrdersByCriteriaAwaitable()
async function getOrdersByCriteriaAwaitable(criteria, order, res) {
    let method = "getOrdersByCriteriaAwaitable";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let values = [];

        let sql = `
            SELECT orderid, order_username, order_userphone, order_barbername, order_daytimeday, order_daytimestart, order_daytimepretty, order_servicedescription, order_servicevalue, order_willusemoretime, isabsent FROM datalogger_orders WHERE TRUE 
        `;

        if (criteria.includes(constants.constants.CRITERIAS.ID)) {
            values.push(order.orderid);
            sql += " AND orderid = $" + values.length.toString() + " ";

        }

        if (criteria.includes(constants.constants.CRITERIAS.ORDER_USER_ID)) {
            values.push(order.order_userid);
            sql += " AND order_userid = $" + values.length.toString() + " ";
        }

        if (criteria.includes(constants.constants.CRITERIAS.DAY_TIME_ID)) {
            values.push(order.order_daytimeid);
            sql += " AND order_daytimeid = $" + values.length.toString() + " ";
        }

        if (criteria.includes(constants.constants.CRITERIAS.ORDER_SERVICE_ID)) {
            values.push(order.order_serverId);
            sql += " AND order_serviceid = $" + values.length.toString() + " ";
        }

        sql += ";";

        let response = await connection.query(sql, values);

        await connection.end();

        if (res != null)
            return res.status(200).send(response.rows);

        return response.rows;

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return [];
    }
}



// MongoDb
/* async function getAllOrdersDao(res) {
    let method = "getAllOrdersDao";
    try {

        mongoose.connect(process.env.MONGODB_STRING).then(value => {
            OrdersSchemaModel.find({}).then(value => {
                mongoose.disconnect();

                return res.status(200).send(value);

            }).catch(err => {
                mongoose.disconnect();
                return errorHandler.handleError(err, method, res);
            });
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}
*/

//PostgreSQL 
// Gets all orders - v400 get from datalogger db
//getAllOrders(res) 
async function getAllOrdersDao(res) {
    let method = "getAllOrdersDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = `
                   SELECT orderid, order_userid, order_username, order_userphone, order_barberid, order_barbertimeid, order_barbername, order_daytimeid, order_daytimeday, order_daytimestart, order_daytimeend, order_daytimepretty, order_servicedescription, order_servicevalue, order_willusemoretime, isabsent FROM datalogger_orders;
                `;

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



async function getNextOrdersDao(res) {
    let method = "getNextOrdersDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = `SELECT o.orderid, u.username as order_username, u.userphone as order_userphone, dt.daytimeday as order_daytimeday, dt.daytimestart as order_daytimestart, dt.daytimepretty as order_daytimepretty, u2.username as order_barbername, s.servicedescription as order_servicedescription, s.servicevalue as order_servicevalue FROM orders o
            INNER JOIN users u ON u.userid = o.order_userid
            INNER JOIN barber_time bt ON bt.barbertimeid = o.order_barbertimeid 
            INNER JOIN daytime dt ON dt.daytimeid = bt.barbertime_daytimeid 
            INNER JOIN users u2 ON u2.userid = bt.barbertime_userid
            INNER JOIN services s ON s.serviceid = o.order_serviceid
            WHERE ((dt.daytimeday)::date >= ( (current_date - interval '3 hour' ) AT TIME ZONE 'America/Sao_Paulo')::date) ;
        `;

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

async function getNextOrdersByBarberIdDao(orderModel, res) {
    const method = "getNextOrdersByBarberIdDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = `SELECT o.orderid, u.username as order_username, u.userphone as order_userphone, dt.daytimeday as order_daytimeday, dt.daytimestart as order_daytimestart, dt.daytimepretty as order_daytimepretty, u2.username as order_barbername, s.servicedescription as order_servicedescription, s.servicevalue as order_servicevalue FROM orders o
        INNER JOIN users u ON u.userid = o.order_userid
        INNER JOIN barber_time bt ON bt.barbertimeid = o.order_barbertimeid 
        INNER JOIN daytime dt ON dt.daytimeid = bt.barbertime_daytimeid 
        INNER JOIN users u2 ON u2.userid = bt.barbertime_userid
        INNER JOIN services s ON s.serviceid = o.order_serviceid
        WHERE ( (dt.daytimeday)::date >= ( (current_date - interval '3 hour') AT TIME ZONE 'America/Sao_Paulo')::date AND bt.barbertime_userid = $1 ) ; `;

        connection.query(sql, [orderModel.order_userid], (err, queryResult) => {
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

//added v4.5.0
async function getOrdersByBarberIdDao(barberId, res) {
    const method = "getOrdersByBarberIdDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let sql = ` SELECT orderid, order_userid, order_username, order_userphone, order_barberid, order_barbertimeid, order_barbername, order_daytimeid, order_daytimeday, order_daytimestart, order_daytimeend, order_daytimepretty, order_servicedescription, order_servicevalue, order_willusemoretime, isabsent FROM datalogger_orders WHERE order_barberid = $1; `;

        connection.query(sql, [barberId], (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }
            console.log(queryResult.rows)
            connection.end();
            return res.status(200).send(queryResult.rows);
        });

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}


//added v4.0.0
async function markAbsentDao(order, res) {
    const method = "markAbsentDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "UPDATE datalogger_orders SET isabsent = $1 WHERE orderid = $2; ";

        let response = await connection.query(sql, [order.isabsent, order.orderid]);

        await connection.end();

        return response.rows;

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}


async function deleteListOfOrderDao(listorderid, res, fromDeleteAccount = false) {
    let method = "deleteListOfOrderDao";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        connection.connect();

        let values = [];
        let sql = "DELETE FROM orders WHERE TRUE AND ";
        sql += " orderid = $1 ";

        values.push(listorderid[0]);

        listorderid.shift()

        listorderid.forEach((element) => {
            values.push(element);
            sql += " OR orderid = $" + values.length.toString() + " ";
        });

        sql += ";";

        connection.query(sql, values, (err, queryResult) => {
            if (err) {
                connection.end();
                return errorHandler.handleError(err, method, res);
            }

            sql = "DELETE FROM datalogger_orders WHERE TRUE AND ";
            sql += " orderid = $1 ";

            connection2.query(sql, values, (err, queryResult2) => {
                if (err) {
                    connection.end();
                    return errorHandler.handleError(err, method, res);
                }
                connection.end();

                if (!fromDeleteAccount)
                    return res.status(200).send({});
            });
        });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function checksIfDaytimeHasBeenScheduled(dayTimeId, barberId) {
    const method = "checksIfDaytimeHasBeenScheduled";
    try {
        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "SELECT o.orderid FROM barber_time bt INNER JOIN orders o ON o.order_barbertimeid = bt.barbertimeid WHERE bt.barbertime_daytimeid = $1 AND bt.barbertime_userid = $2; ";

        let response = await connection.query(sql, [dayTimeId, barberId]);

        await connection.end();

        return response.rows;

    }
    catch (e) {

    }
}

module.exports = {
    createOrder: createOrder,
    getOrdersByCriteria: getOrdersByCriteria,
    getAllOrdersDao: getAllOrdersDao,
    getNextOrdersDao: getNextOrdersDao,
    deleteListOfOrderDao: deleteListOfOrderDao,
    getNextOrdersByBarberIdDao: getNextOrdersByBarberIdDao,
    markAbsentDao: markAbsentDao,
    checksIfDaytimeHasBeenScheduled: checksIfDaytimeHasBeenScheduled,
    getOrdersByCriteriaAwaitable: getOrdersByCriteriaAwaitable,
    getOrdersByBarberIdDao: getOrdersByBarberIdDao
}
