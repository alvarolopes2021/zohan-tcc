const bcrypt = require('bcrypt');

const userDao = require('./../daos/userDao');
const errorHandler = require('./errors/errorHandler');
const constants = require('./../constants');
const { User } = require('./../models/userModel');

async function getUsers(req, res) {
    let method = "getUsers";
    try {
        let criteria = [constants.constants.CRITERIAS.ROLE]
        let user = new User();
        user.usertype = String(req.query.ROLE);
        let response = await userDao.getUserByCriteria(criteria, user, res);

        if (response.length == 0) {
            res.status(404).send(constants.constants.ERRORS_TRANSLATED.USER_NOT_FOUND);
            return;
        }

        res.status(200).send(response);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return;
    }
}

async function userProfile(req, res) {
    let method = "userProfile";
    try {
        let criteria = [constants.constants.CRITERIAS.ID]
        let user = new User();

        user.userid = String(req.query.SESSION_CLIENT_ID);
        let response = await userDao.getUserByCriteria(criteria, user, res);

        if (response.length == 0) {
            res.status(404).send(constants.constants.ERRORS_TRANSLATED.USER_NOT_FOUND);
            return;
        }

        user.useremail = response[0].useremail;
        user.userphone = response[0].userphone;

        res.status(200).send(user);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return;
    }
}

async function updateUserProfileService(req, res) {
    let method = "updateUserProfileService";
    try {
        let angularUserModel = req.body;

        let user = new User();
        user.userid = angularUserModel.userid;
        user.username = angularUserModel.username;
        user.useremail = angularUserModel.useremail;
        user.userphone = angularUserModel.userphone;
        user.usertype = angularUserModel.usertype;

        /*
        console.log(angularUserModel);
        console.log(user);
        */


        if (angularUserModel.newpsw != null && angularUserModel.newpsw != undefined) {
            let criteria = [constants.constants.CRITERIAS.ID];
            let userResponse = await userDao.getUserByCriteria(criteria, user, res);

            //console.log(userResponse);

            if (userResponse.length <= 0) {
                res.status(404).send(constants.constants.ERRORS_TRANSLATED.USER_NOT_FOUND);
                return;
            }

            if (bcrypt.compareSync(angularUserModel.userpsw, userResponse[0].userpsw)) {
                let salt = await bcrypt.genSalt();
                user.userpsw = bcrypt.hashSync(angularUserModel.newpsw, salt);
                userDao.updateUserPsw(user, res);
            }
            else {
                res.status(401).send(constants.constants.ERRORS_TRANSLATED.PASSWORD_DONT_MATCH);
                return;
            }

        }

        userDao.updateUserDao(user, res);

    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return;
    }
}

//added v3.7.0
async function addNotificationSubscriptionService(req, res) {

    const method = "addNotificationSubscriptionService";
    try {
        let userModel = new User();

        userModel.userid = req.body.userid;

        let criteria = [constants.constants.CRITERIAS.ID];

        let userResponse = await userDao.getUserByCriteriaV2(criteria, userModel, null);

        userResponse[0].pushsubscription.push(req.body.pushsubscription[0]);

        userModel.pushsubscription = userResponse[0].pushsubscription;

        userDao.insertPushSubscriptionDao(userModel, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return;
    }
}
// end v3.7.0

async function deleteAccountService(req, res) {

    const method = "deleteAccountService";

    try {
        let user = new User();
        user.userid = req.body.userid;
        userDao.deleteAccountDao(user, res);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return;
    }
}

module.exports = {
    getUsers: getUsers,
    userProfile: userProfile,
    updateUserProfileService: updateUserProfileService,
    deleteAccountService: deleteAccountService,
    addNotificationSubscriptionService: addNotificationSubscriptionService
}