const express = require('express');
const router = express.Router();

const servicesService = require('./../services/servicesService');


router.post('/add-services', async (req, res) => {
    try{
        servicesService.insertServices(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
}); 


router.get('/get-services', async (req, res) => {
    try{
        servicesService.getServices(res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.delete('/delete-services', async (req, res) => {
    try{
        servicesService.deleteServices(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.put('/update-services', async (req, res) => {
    try{
        servicesService.updateServicesService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});



module.exports = app => app.use('/services', router);