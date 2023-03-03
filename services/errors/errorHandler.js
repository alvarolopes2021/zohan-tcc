var constants = require('../../constants');
var devErrorHandler = require('./devErrorHandler');
var applicationErrorHandler = require('./applicationErrorHandler');


async function handleError(err, method, res) {

    if (String(err).includes(constants.constants.ERRORS.DUPLICATE_ENTRY) || String(err).includes(constants.constants.ERRORS.DUPLICATE_KEY)) {
        applicationErrorHandler.sendResponse(res, 409,
            constants.constants.ERRORS_TRANSLATED.DUPLICATE_ENTRY_CELLPHONE);
    }
    else if (String(err).includes(constants.constants.ERRORS.TABLE_) &&
        String(err).includes(constants.constants.ERRORS.DOESNT_EXISTS)) {

        applicationErrorHandler.sendResponse(res, 404,
            constants.constants.ERRORS_TRANSLATED.DAY_NOT_INSERTED);
    }
    else if (String(err).includes(constants.constants.ERRORS_TRANSLATED.USER_NOT_FOUND)) {
        applicationErrorHandler.sendResponse(res, 404,
            constants.constants.ERRORS_TRANSLATED.USER_NOT_FOUND);
    }
    else if (String(err).includes(constants.constants.ERRORS_TRANSLATED.DAY_TIME_ALREADY_INSERTED)) {
        applicationErrorHandler.sendResponse(res, 404,
            constants.constants.ERRORS_TRANSLATED.DAY_TIME_ALREADY_INSERTED);
    }

    devErrorHandler.createLog(err, method);
}


module.exports.handleError = handleError;
