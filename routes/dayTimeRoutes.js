const express = require('express');
const dayTimeDao = require('../daos/dayTimeDao');
const router = express.Router();

const dayTimeService = require('./../services/dayTimeService');

router.post('/create-schedule', async (req, res) => {
    try{        
        let insertions = dayTimeService.insertDayTime(req, res);                   
    }
    catch(e){
        res.status(400).send(e);
    }    
});

router.post('/create-schedule-from-interval', async (req, res) => {
    try{        
        let insertions = dayTimeService.insertDayTimeFromIntervalService(req, res);                   
    }
    catch(e){
        res.status(400).send(e);
    }    
});

router.post('/insert-schedule', async (req, res) => {
    try{
        dayTimeService.insertDayTime(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.get('/get-schedules', async (req, res) => {
    try{
        dayTimeService.getDayTime(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.put('/update-schedules', async (req, res) => {
    try{
        dayTimeService.updateDayTime(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.delete('/delete-dayTime', async (req, res) => {
    try{
        dayTimeService.deleteDayTime(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});


router.get('/get-available-dayTime', async (req, res) => {
    try{
        dayTimeService.getAvailableDayTime(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.get('/get-available-dayTime-uses-more-time', async (req, res) => {
    try{
        dayTimeService.getAvailableDayTimeUsesMoreTimeService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.get('/get-assigned-daytime', async (req, res) => {
    try{
        dayTimeService.getBarberAssignedTimeService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

module.exports = app => app.use('/schedule', router);

