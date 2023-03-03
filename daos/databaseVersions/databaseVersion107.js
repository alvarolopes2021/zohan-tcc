const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const errorHandler = require('../../services/errors/errorHandler');
const { User } = require('./../../models/userModel');
const constants = require('./../../constants');
const userDao = require('./../userDao');

async function runDatabaseVersion107() {
    const method = "runDatabaseVersion107";
    try {
        let user = new User(); 

        user.userid = uuidv4();
        user.username = constants.constants.ROLES.ADMIN;
        user.useremail = '';
        user.userphone = constants.constants.DEFAULT_DATA.PHONE;
        user.usertype = constants.constants.ROLES.ADMIN;

        let userpsw = Buffer.from(constants.constants.DEFAULT_DATA.ONE_TO_SIX).toString('base64')
        let salt = await bcrypt.genSalt(10);
        user.userpsw = bcrypt.hashSync(userpsw, salt);

        userDao.createUser(user, null);
    }
    catch (e) {
        errorHandler.handleError(e, method, null);
        return null;
    }
}


module.exports = [
    runDatabaseVersion107
]