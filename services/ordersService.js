require('dotenv').config();
const { v4: uuidv4 } = require('uuid');

const errorHandler = require('./errors/errorHandler');
const { OrdersModel } = require('./../models/ordersModel');
const { User } = require('./../models/userModel');
const constants = require('./../constants');
const ordersDao = require('./../daos/ordersDao');
const userDao = require('./../daos/userDao');
const barberTimeDao = require('./../daos/barberTimeDao');
const pushNotificationService = require('./pushNotificationService');

async function createOrderService(req, res) {
    let method = "createOrderService";
    try {

        let criteria = [
            constants.constants.CRITERIAS.USER_ID,
            constants.constants.CRITERIAS.DAY_TIME_ID
        ];

        let data = ["", req.body.barberid, req.body.order_daytimeid];

        let barberTimeId =
            await barberTimeDao.getBarberTimeByCriteriaDao(criteria, data, res);

        let ordersModel = new OrdersModel();

        ordersModel.orderid = uuidv4();
        ordersModel.order_userid = req.body.order_userid;
        ordersModel.order_barbertimeid = barberTimeId.barbertimeid;
        ordersModel.order_daytimeid = req.body.order_daytimeid;
        ordersModel.order_serviceid = req.body.order_serviceid;

        let check = await ordersDao.checksIfDaytimeHasBeenScheduled(ordersModel.order_daytimeid, ordersModel.order_barbertimeid);

        if (check.length > 0)
            return errorHandler.handleError(constants.constants.ERRORS_TRANSLATED.DAY_TIME_ALREADY_INSERTED, method, res);

        ordersModel.order_servicedescription = req.body.order_servicedescription;
        ordersModel.order_servicevalue = req.body.order_servicevalue;
        ordersModel.order_willusemoretime = req.body.order_willusemoretime;
        ordersModel.order_userphone = req.body.order_userphone;

        // TESTS IF IT IS ADMIN TRYING TO SCHEDULE
        if (ordersModel.order_userphone != null && ordersModel.order_userphone != "") {
            let criteria = [constants.constants.CRITERIAS.PHONE];
            let user = new User();
            user.userphone = req.body.order_userphone;
            let response = await userDao.getUserByCriteria(criteria, user, res);

            if (response == null || response.length <= 0)
                return errorHandler.handleError(constants.constants.ERRORS_TRANSLATED.USER_NOT_FOUND, method, res);

            ordersModel.order_userid = response[0].userid;
            ordersModel.order_username = response[0].username;
        }

        ordersModel.order_barbertimeid = barberTimeId.barbertimeid;

        ordersDao.createOrder(ordersModel, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getOrdersByCriteria(req, res) {
    let method = "getOrdersByCriteria";
    try {
        let orderModel = new OrdersModel();

        let criteria = [constants.constants.CRITERIAS.ORDER_USER_ID];

        orderModel.order_userid = req.query.SESSION_CLIENT_ID;

        ordersDao.getOrdersByCriteria(criteria, orderModel, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getNextOrdersByBarberIdService(req, res) {
    const method = 'getNextOrdersByBarberIdService';
    try {
        let orderModel = new OrdersModel();

        orderModel.order_userid = req.query.SESSION_CLIENT_ID;

        ordersDao.getNextOrdersByBarberIdDao(orderModel, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

//added v4.5.0
async function getOrdersByBarberIdService(req, res){
    const method = 'getOrdersByBarberIdService';
    try{
        let orderModel = new OrdersModel();

        let barberId = req.query.SESSION_CLIENT_ID;

        ordersDao.getOrdersByBarberIdDao(barberId, res);
    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

async function getAllOrdersService(req, res) {
    let method = "getAllOrdersService";
    try {
        ordersDao.getAllOrdersDao(res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getNextOrdersService(req, res) {
    let method = "getNextOrdersService";
    try {
        ordersDao.getNextOrdersDao(res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

//added v4.0.0
async function markAbsentService(req, res) {
    let method = "markAbsentService";
    try {
        let orderModel = new OrdersModel();

        orderModel.orderid = req.body.orderid;
        orderModel.isabsent = req.body.isabsent;

        ordersDao.markAbsentDao(orderModel, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function deleteListOfOrderService(req, res) {
    let method = "deleteListOfOrderService";
    try {
        let listOrderId = req.query.ORDER_ID;

        //added v3.7.0 - gets the order to be deleted
        let criteria = [constants.constants.CRITERIAS.ID];
        let order = new OrdersModel();
        order.orderid = listOrderId;
        let deletedOrders = await ordersDao.getOrdersByCriteriaAwaitable(criteria, order, null);
        //end v3.7.0

        ordersDao.deleteListOfOrderDao([listOrderId], res);

        //added v3.7.0

        //criteria = [constants.constants.CRITERIAS.ROLE];
        //let userModel = new User();
        //userModel.usertype = constants.constants.ROLES.ADMIN;
        let userResponse = await userDao.getAllUsersAwaitableDao(res);

        if (userResponse.length <= 0)
            return;

        if (deletedOrders.length <= 0)
            return;

        let orderDate = new Date(deletedOrders[0].order_daytimeday).toISOString().split("T")[0].split("-").reverse().join("/");

        let pushBody = `Cliente: ${deletedOrders[0].order_username} \nData: ${orderDate} \nHorário: ${deletedOrders[0].order_daytimestart}`;


        // for each user
        userResponse.forEach(user => {
            let i = 0;
            if (user.usertype == constants.constants.ROLES.ADMIN) {
                //for each subscription it has
                user.pushsubscription.forEach(subscription => {
                    pushNotificationService.sendPushNotification(subscription, pushBody)
                        .then((value) => i++)
                        .catch((e) => {
                            let elements = user.pushsubscription.filter(predicate => predicate != subscription);

                            user.pushsubscription = elements;

                            userDao.insertPushSubscriptionDao(user, null);

                            errorHandler.handleError(e, method, null);
                        });
                });
            }
        });
        //end v3.7.0       
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

module.exports = {
    createOrderService: createOrderService,
    getOrdersByCriteria: getOrdersByCriteria,
    getAllOrdersService: getAllOrdersService,
    getNextOrdersService: getNextOrdersService,
    markAbsentService: markAbsentService,
    deleteListOfOrderService: deleteListOfOrderService,
    getNextOrdersByBarberIdService: getNextOrdersByBarberIdService,
    getOrdersByBarberIdService: getOrdersByBarberIdService
}