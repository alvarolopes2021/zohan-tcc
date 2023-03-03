const express = require('express');
const router = express.Router();

const userService = require('./../services/userService');

router.get('/get-all-users', async (req, res) => {
    try {
        userService.getUsers(req, res);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.get('/user-profile', async (req, res) => {
    try {
        userService.userProfile(req, res);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.post('/add-notification-subscription', async (req, res) => {
    try {
        userService.addNotificationSubscriptionService(req, res);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.put('/update-user-profile', async (req, res) => {
    try {
        userService.updateUserProfileService(req, res);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/delete-account', async (req, res) => {
    try {
        userService.deleteAccountService(req, res);
    }
    catch (e) {
        res.status(400).send(e);
    }
});

module.exports = app => app.use('/user', router);
