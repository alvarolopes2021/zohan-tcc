const express = require('express');
const router = express.Router();

const barberService = require('./../services/barbersService');

router.get('/get-all-barbers', async (req, res) => {
    try{
        barberService.getAllBarbersService(res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.delete('/delete-barber/:id', async (req, res) => {
    try{
        barberService.deleteListOfBarber(req.params['id'], res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

module.exports = app => app.use('/barbers', router);