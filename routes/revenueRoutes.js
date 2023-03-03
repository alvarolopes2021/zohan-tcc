const express = require('express');
const router = express.Router();

const revenueService = require('./../services/revenueService');

router.get('/get-revenue', async (req, res) => {
    try{
        revenueService.getAllRevenueService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});


module.exports = app => app.use('/revenue', router);