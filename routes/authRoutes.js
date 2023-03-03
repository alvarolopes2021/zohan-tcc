const express = require('express');
const router = express.Router();

const authService = require('../services/authService');

router.post('/login', (req, res) => {
    try{
        authService.login(req, res);
    }
    catch(e){
        res.status(400).send('catch');
    }
});

router.post('/signup', (req, res) => {
    try{
        authService.signupService(req, res);
    }
    catch(e){
        res.status(400).send(e.message);
    }
});

module.exports = app => app.use('/auth', router);