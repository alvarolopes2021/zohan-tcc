const { v4: uuidv4 } = require('uuid');

const errorHandler = require('./errors/errorHandler');
const dayTimeDao = require('./../daos/dayTimeDao');
const { DayTimeModel } = require('../models/dayTimeModel');
const { assignBarberTimeAfterInsertDayTime } = require('./barberTimeService');

async function insertDayTime(req, res) {
    let method = "insertDayTime";

    try {
        let dayTimeList = req.body;  // data as it is

        let dayTimeModelList = [];

        dayTimeList.forEach(element => {
            let dayTimeModel = new DayTimeModel();
            dayTimeModel.daytimeid = uuidv4();
            dayTimeModel.daytimeday = element.daytimeday;
            dayTimeModel.daytimestart = element.daytimestart;
            dayTimeModel.daytimeend = element.daytimeend;
            dayTimeModel.daytimepretty = element.daytimepretty;
            dayTimeModelList.push(dayTimeModel);
        });

        let response = dayTimeDao.insertSchedule(dayTimeModelList, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function insertDayTimeFromIntervalService(req, res) {
    let method = "insertDayTimeFromIntervalService";

    try {

        let dayTimeModelList = createDayTimeModelList(req.body.daytimeday, req.body.daytimestart, req.body.daytimeend, req.body.jumps);

        let response = dayTimeDao.insertSchedule(dayTimeModelList, res);

        //added v4.5.0
        assignBarberTimeAfterInsertDayTime(dayTimeModelList, res);
        

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getDayTime(req, res) {
    let method = "getDayTime";
    try {
        let date = req.query.DATE;

        dayTimeDao.getSchedules(date, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function updateDayTime(req, res) {
    let method = "updateDayTime";
    try {
        let dayTimeObject = req.body;

        dayTimeDao.updateDayTime(dayTimeObject, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function deleteDayTime(req, res) {
    let method = "deleteDayTime";
    try {
        let daytimeid = req.query.DAY_TIME;

        let dayTimeObject = new DayTimeModel();
        dayTimeObject.daytimeid = daytimeid;
        dayTimeDao.deleteAListOfDayTime([dayTimeObject], res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getAvailableDayTime(req, res) {
    let method = "getAvailableDayTime";
    try {
        let date = req.query.DATE;
        let barbertime_userid = req.query.BARBERTIME_USERID;

        dayTimeDao.getAvailableDayTimeDao(barbertime_userid, date, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getAvailableDayTimeUsesMoreTimeService(req, res) {
    let method = "getAvailableDayTimeUsesMoreTimeService";
    try {
        let date = req.query.DATE;
        let barbertime_userid = req.query.BARBERTIME_USERID;

        dayTimeDao.getAvailableDayTimeUsesMoreTimeDao(barbertime_userid, date, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

async function getBarberAssignedTimeService(req, res) {
    let method = "getBarberAssignedTimeService";
    try {
        let date = req.query.DATE;
        let barbertime_userid = req.query.BARBERTIME_USERID;

        dayTimeDao.getBarberAssignedTimeDao(barbertime_userid, date, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}

function createDayTimeModelList(day, start, end, jumps) {
    const method = 'createDayTimeModel';
    try {

        let startSplit = start.split(":");
        let startHour = parseInt(startSplit[0]);
        let startMinute = parseInt(startSplit[1]);
        let jumpsNumber = parseInt(jumps);
        let endSplit = end.split(":");
        let endHour = parseInt(endSplit[0]);
        let endMinute = parseInt(endSplit[1]);

        let dayTimeModeList = [];

        while (true) {

            if (startHour > endHour)
                break;

            if (startHour == endHour && startMinute > endMinute)
                break;

            let dayTimeModel = new DayTimeModel();
            dayTimeModel.daytimeid = uuidv4();
            dayTimeModel.daytimeday = day;

            let startHourString = startHour.toString().length == 1 ? "0"+startHour.toString() : startHour.toString();
            let startMinuteString = startMinute.toString().length == 1 ? "0"+startMinute.toString() : startMinute.toString();

            dayTimeModel.daytimestart = startHourString + ":" + startMinuteString + ":00";

            dayTimeModel.daytimepretty = startHourString + ":" + startMinuteString + "-";

            let rest = startMinute + jumpsNumber;
            if (rest >= 60) {
                rest = rest - 60;
                startHour = startHour + 1;
            }
            startMinute = rest;

            startHourString = startHour.toString().length == 1 ? "0"+startHour.toString() : startHour.toString();
            
            startMinuteString = startMinute.toString().length == 1 ? "0"+startMinute.toString() : startMinute.toString();

            dayTimeModel.daytimeend = startHourString + ":" + startMinuteString + ":00";

            dayTimeModel.daytimepretty += startHourString + ":" + startMinuteString;

            dayTimeModeList.push(dayTimeModel);

        }

        return dayTimeModeList;

    }
    catch (e) {
        errorHandler.handleError(e, method, null);
    }
}


module.exports = {
    insertDayTime: insertDayTime,
    insertDayTimeFromIntervalService: insertDayTimeFromIntervalService,
    updateDayTime: updateDayTime,
    getDayTime: getDayTime,
    deleteDayTime: deleteDayTime,
    getAvailableDayTime: getAvailableDayTime,
    getBarberAssignedTimeService: getBarberAssignedTimeService,
    getAvailableDayTimeUsesMoreTimeService: getAvailableDayTimeUsesMoreTimeService
}

