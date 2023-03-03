const errorHandler = require('./errors/errorHandler');
const barberDao = require('./../daos/barbersDao');


async function getAllBarbersService(res){
    const method = "getAllBarbers";
    try{
        barberDao.getAllBarbersDao(res);
    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

async function deleteListOfBarber(barberId, res){
    const method = "deleteListOfBarber";
    try{
        barberDao.deleteListOfBarberDao([barberId], res);
    }
    catch(e){
        errorHandler.handleError(e, method, res);
    }
}

module.exports = {
    getAllBarbersService: getAllBarbersService,
    deleteListOfBarber: deleteListOfBarber
}