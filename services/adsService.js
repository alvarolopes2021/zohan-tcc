const { v4: uuidv4 } = require('uuid');

const adsDao = require('./../daos/adsDao');
const { AdsModel } = require('./../models/adsModel');
const errorHandler = require('./errors/errorHandler');

async function insertAds(req, res){
    let method = "insertAds";
    try{
        let ad = new AdsModel();
        ad.adid = uuidv4();
        
        ad.addescription = req.body.addescription;

        adsDao.insertAds(ad, res);

    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

async function getAds(req, res){
    let method = "getAds";
    try{
        adsDao.getAds(res);
    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

module.exports = {
    insertAds: insertAds,
    getAds: getAds
}