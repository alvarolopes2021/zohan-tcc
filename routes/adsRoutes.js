const express = require('express');
const router = express.Router();

const adsService = require('./../services/adsService');

router.get('/get-ads', async (req, res) => {
    try{
        adsService.getAds(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.post('/insert-ad', async (req, res) => {
   try{
        adsService.insertAds(req, res);
   } 
   catch(e){
       res.status(400).send(e);
   }
});

module.exports = app => app.use('/ads', router);
