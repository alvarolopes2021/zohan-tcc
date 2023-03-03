class EditDayTimeActionsModel{
    daytimeid = "";
    date = "";
    action = "";
    oldvalue = "";
    newvalue = "";
    
    constructor(obj){
        Object.assign(this, obj);
    }

    keys = {
        ADDED: "ADDED",
        DELETED: "DELETED",
        UPDATED: "UPDATED"
    }
}

module.exports.EditDayTimeActionsModel = EditDayTimeActionsModel;