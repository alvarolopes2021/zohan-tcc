const express = require('express');
const router = express.Router();

const ordersService = require('./../services/ordersService');

router.post('/create-order', async (req, res) => {
    try{
        ordersService.createOrderService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.get('/get-orders-by-user-id', async (req, res) => {
    try{
        ordersService.getOrdersByCriteria(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.get('/get-all-orders', async (req, res) => {
    try{
        ordersService.getAllOrdersService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.get('/get-next-orders', async (req, res) => {
    try{
        ordersService.getNextOrdersService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.get('/get-next-orders-by-barber-id', async (req, res) => {
    try{
        ordersService.getNextOrdersByBarberIdService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

//added v4.5.0
router.get('/get-orders-by-barber-id', async (req, res) => {
    try{
        ordersService.getOrdersByBarberIdService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});


router.put('/mark-absent', async (req, res) => {
    try{
        ordersService.markAbsentService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});

router.delete('/cancel-order', async (req, res) => {
    try{
        ordersService.deleteListOfOrderService(req, res);
    }
    catch(e){
        res.status(400).send(e);
    }
});


module.exports = app => app.use('/orders', router);