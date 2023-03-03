const express = require('express');
const router = express.Router();

const barberTimeService = require('./../services/barberTimeService');
const { constants } = require('./../constants');

router.post('/assign-barber-time', async (req, res) => {
    try{
        barberTimeService.assignBarberTime(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.post('/assign-list-to-barber-time', async (req, res) => {
    try{
        barberTimeService.assignBarberTime(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.get('/get-barber-time-by-userid-and-daytimeid', async (req, res) => {
    try{
        let criteria = [
            constants.CRITERIAS.DAY_TIME_ID, 
            constants.CRITERIAS.USER_ID
        ];
        barberTimeService.getBarberTimeByCriteriaService(criteria, req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.delete('/remove-assignment', async (req, res) => {
    try{
        barberTimeService.removeAssignmentService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

module.exports = app => app.use('/barber-time', router);