const { v4: uuidv4 } = require('uuid');

const errorHandler = require('./errors/errorHandler');
const barberTimeDao = require('./../daos/barberTimeDao');
const barbersDao = require('./../daos/barbersDao');
const { BarberTimeModel } = require('./../models/barberTimeModel');

async function assignBarberTime(req, res) {
    const method = "assignBarberTime";
    try {

        let dataList = [];

        req.body.barbertime_daytimeid_list.forEach(element => {
            let barberTimeModel = new BarberTimeModel();
            barberTimeModel.barbertimeid = uuidv4();
            barberTimeModel.barbertime_userid = req.body.barbertime_userid;
            barberTimeModel.barbertime_daytimeid = element;
            dataList.push(Object.values(barberTimeModel));
        });

        barberTimeDao.insertBarberTimeDao(dataList, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

//added v4.5.0
async function assignBarberTimeAfterInsertDayTime(dayTimeList, res) {
    const method = 'assignBarberTimeAfterInsertDayTime';
    try {
        const barbers = await barbersDao.getAllBarbersDaoAwaitable(null);

        if (barbers.length <= 0)
            return;

        let dataList = [];

        barbers.forEach(barber => {
            dayTimeList.forEach(daytime => {
                let barberTimeModel = new BarberTimeModel();
                barberTimeModel.barbertimeid = uuidv4();
                barberTimeModel.barbertime_userid = barber.userid
                barberTimeModel.barbertime_daytimeid = daytime.daytimeid;
                dataList.push(Object.values(barberTimeModel));
            });
        });

        barberTimeDao.insertBarberTimeDao(dataList, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function removeAssignmentService(req, res) {
    const method = "removeAssignmentService";
    try {

        let barberTimeModel = new BarberTimeModel();
        barberTimeModel.barbertime_userid = req.query.BARBERTIME_USERID;
        barberTimeModel.barbertime_daytimeid = req.query.BARBERTIME_DAYTIMEID;

        barberTimeDao.removeAssignmentDao(Object.values(barberTimeModel), res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getBarberTimeByCriteriaService(criteria, req, res) {
    const method = "getBarberTimeByCriteriaService";
    try {

        let barberTimeModel = new BarberTimeModel();
        barberTimeModel.barbertime_userid = req.query.BARBERTIME_USERID;
        barberTimeModel.barbertime_daytimeid = req.query.BARBERTIME_DAYTIMEID;

        return await barberTimeDao.getBarberTimeByCriteriaDao(criteria, barberTimeModel, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

module.exports = {
    assignBarberTime: assignBarberTime,
    removeAssignmentService: removeAssignmentService,
    getBarberTimeByCriteriaService: getBarberTimeByCriteriaService,
    assignBarberTimeAfterInsertDayTime: assignBarberTimeAfterInsertDayTime
}