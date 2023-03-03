const { v4: uuidv4 } = require('uuid');

const errorHandler = require('./errors/errorHandler');
const { ServiceModel } = require('./../models/servicesModel');
const servicesDao = require('./../daos/servicesDao');

async function insertServices(req, res){
    let method = "insertServices";
    try{
        let requestList = Array.from(req.body);        
        let serviceModelList = [];

        requestList.forEach((element) => {            
            let serviceModel = new ServiceModel();
            serviceModel.serviceid = uuidv4();
            serviceModel.servicedescription = element.servicedescription;
            serviceModel.servicevalue = element.servicevalue;
            serviceModelList.push(serviceModel);
        });

        servicesDao.insertServices(serviceModelList, res);

    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

async function getServices(res){
    let method = "getServies";
    try{
        servicesDao.getServices(res);
    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

async function deleteServices(req, res){
    let method = "deleteServices";
    try{
        let serviceIds = req.query.SERVICE_ID; 
        servicesDao.deleteListServices([serviceIds], res);
    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

async function updateServicesService(req, res){
    let method = "updateServicesService";
    try{
        let serviceModel = req.body;        
        servicesDao.updateServiceDao(serviceModel, res);
    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

module.exports = {
    getServices: getServices,
    insertServices: insertServices,
    deleteServices: deleteServices,
    updateServicesService: updateServicesService
}