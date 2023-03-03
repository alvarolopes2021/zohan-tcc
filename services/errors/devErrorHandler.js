const constants = require('../../constants');
const utils = require('../../utils/utils');
const errorHandler = require('./errorHandler');

async function createLog(err, method){
    let thisMethod = "createLog";
    try{
       
        let date = utils.getLogDate();

        if(!utils.pathExists(constants.constants.PATHS.LOG_FILE_DIR))
            utils.createDir(constants.constants.PATHS.LOG_FILE_DIR);

        if(!utils.pathExists(constants.constants.PATHS.LOG_FILE_PATH)){
            
            utils.createFile(constants.constants.PATHS.LOG_FILE_PATH);

            var data = (
                date.year+'/'+date.month+'/'+date.day + " " + date.time + '\n' + 
                ' METHOD: ' + method + " \n " + 
                err + ' \n '
            );

            utils.writeFiles(constants.constants.PATHS.LOG_FILE_PATH, data);          

            return;
        } 

        var data = ( 
            date.year+'/'+date.month+'/'+date.day + " " + date.time + '\n ' + 
            'METHOD: ' + method + " \n " + 
            err + "\n" + '\n' +
            utils.readFilesSync(constants.constants.PATHS.LOG_FILE_PATH)            
        );
        
        utils.writeFiles(
            constants.constants.PATHS.LOG_FILE_PATH, 
            data
        );
       
    }
    catch(err){
        errorHandler.handleError(err, thisMethod, null);
    }
}

module.exports.createLog = createLog;