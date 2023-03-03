async function sendResponse(res, status, error){
    if(res != null)
        res.status(status).send(error);
}

module.exports.sendResponse = sendResponse;