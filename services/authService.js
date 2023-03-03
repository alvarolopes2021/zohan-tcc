const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

var userDao = require('../daos/userDao');
const { User } = require('../models/userModel');
const { constants } = require('../constants');
const errorHandler = require("./errors/errorHandler");


function createToken(params) {
    return jwt.sign({ params }, process.env.SECREDO_TOKEN, {
        expiresIn: parseInt(process.env.EXPIRES_IN)  // 12h
    })
}


async function signup(req, res) {
    let method = "signup";
    try {
        var user = new User();

        user.userid = uuidv4();
        user.username = req.body.username;
        user.userphone = req.body.userphone;
        user.useremail = '';

        let salt = await bcrypt.genSalt();
        user.userpsw = bcrypt.hashSync(req.body.userpsw, salt);

        user.usertype = req.body.usertype;

        var response = await userDao.createUser(user, res);

        if (response)
            await res.status(201).json({});
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return null;
    }
}

async function login(req, res) {
    let method = "login";
    try {
        var user = new User();

        user.userphone = req.body.userphone;

        user.userpsw = req.body.userpsw;

        let criteria = [constants.CRITERIAS.PHONE];

        var response = await userDao.getUserByCriteria(criteria, user, res); // returns a list [0 or more]

        if (response.length == 0) {
            res.status(404).send(constants.ERRORS_TRANSLATED.USER_NOT_FOUND);
            return;
        }
        let match = bcrypt.compareSync(user.userpsw, response[0].userpsw);

        if (match) {
            let param = Buffer.from(
                constants.CRITERIAS.ROLE + "=" + response[0].usertype + ";" +
                constants.CRITERIAS.USERNAME + "=" + response[0].username + ";" + 
                constants.CRITERIAS.ID + "=" + response[0].userid 
            ).toString('base64');

            let token = createToken(param);

            /*
            res.cookie(constants.COOKIES.SESSION_ID, token, {
                httpOnly: true,
                maxAge: parseInt(process.env.EXPIRES_IN),
                secure: true,
                sameSite: "none",
                credentials: "include"
            });
            */

            let entity = new User();
            entity.userid = response[0].userid;
            entity.username = response[0].username;
            entity.usertype = response[0].usertype;
            entity.usertoken.expires = process.env.EXPIRES_IN;
            entity.usertoken.token = token;

            res.json(entity);

            return;
        }

        await res.status(404).send(constants.ERRORS_TRANSLATED.PASSWORD_OR_PHONE_WRONG);
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
        return null;
    }
}

module.exports = {
    signupService: signup,
    login: login
}