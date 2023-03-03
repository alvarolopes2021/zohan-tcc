const errorHandler = require('./errors/errorHandler');
const revenueDao = require('../daos/revenueDao');
const constants = require('../constants');

async function getAllRevenueService(req, res) {
    const method = "getAllRevenueService";
    try {
        let revenueParam = JSON.parse(req.query.REVENUE_PARAMS);

        if (revenueParam.barberid != null ) {
            let response = await revenueDao.getRevenueFromIntervalAndBarberIdDao(revenueParam, res);

            let total = 0;

            if (response.length <= 0) {
                return res.status(200).send({total});
            }
            
            response.forEach(element => {
                if(!element.isabsent)
                    total = total + Number.parseFloat(element.order_servicevalue.replace("R$", ""));
            });

            return res.status(200).send({ total });
        }
        
        let response = await revenueDao.getAllRevenueFromIntervalOnlyDao(revenueParam, res);

        let total = 0;

        if (response.length <= 0) {
            return res.status(200).send({total});
        }

        response.forEach(element => {
            if(!element.isabsent)
                total = total + Number.parseFloat(element.order_servicevalue.replace("R$", ""));
        });

        return res.status(200).send({ total });
    }
    catch (e) {
        errorHandler.handleError(e, method, res);
    }
}


module.exports = {
    getAllRevenueService: getAllRevenueService
}