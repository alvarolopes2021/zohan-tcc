class OrdersModel {

    orderid = "";

    order_userid = "";
    order_username = "";
    order_userphone = "";
        
    order_barbertimeid = "";

    order_barbername = "";

    order_daytimeid = "";
    order_daytimeday = "";
    order_daytimestart = "";
    order_daytimeend = "";
    order_daytimepretty = "";

    order_serviceid = "";
    order_servicedescription = "";
    order_servicevalue = "";

    order_willusemoretime = false;

    barberid = "";
    
    isabsent = false;    
    
    orderdate = new Date();
    
    constructor() {

    }
}

module.exports = {
    OrdersModel: OrdersModel
};