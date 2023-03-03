class DayTimeModel{

    daytimeid = "";

    daytimeday = "";

    daytimestart = "";

    daytimeend = "";

    daytimepretty = "";

    constructor(obj){
        Object.assign(this, obj);
    }

}

module.exports.DayTimeModel = DayTimeModel;