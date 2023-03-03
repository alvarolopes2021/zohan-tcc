var fs  = require('fs');

function pathExists(dirPath){
    return fs.existsSync(dirPath);
}

function createDir(dirPath){
    try{
        fs.mkdir(dirPath, function(error){
            if(error)
                console.log("Couldn't create directory: \n " + error);
        });
    }
    catch(err){
        console.log("Catch: Couldn't create directory \n " + err);
    }        
}

function createFile(filePath){
    fs.writeFile( 
        filePath,
        '',         
        function(error){
            if(error)
                console.log("Couldn't create the file: \n" + error);
        }
    );
}


function writeFiles(path, data){
    fs.writeFile( 
        path,

        data, 

        function(error){
            if(error)
                console.log("Couldn't Write the file: \n" + error);
        }
    );
}

function readFilesSync(path){
    return fs.readFileSync(path, 'utf-8', (readError, fileData) =>{
        if(readError)
            console.log("Could not read the file: "+ path +"\n"+ readError );
    });
}


function getLogDate(){
    let date = new Date();

    let day = date.getDate().toString().length == 1 ? "0"+date.getDate().toString() : date.getDate();

    let month = date.getMonth() + 1;
    month = month.toString().length == 1 ? ("0" + month) : month;

    let year = date.getFullYear();
    let time = 
        (date.getHours().toString().length == 1 ? "0"+date.getHours() : date.getHours() ) + ":" +
        (date.getMinutes().toString().length == 1 ? "0"+date.getMinutes() : date.getMinutes()) + ":" +
        (date.getSeconds().toString().length == 1 ? "0"+date.getSeconds() : date.getSeconds() );
    
    let logDate = {
        day: day,
        month: month,
        year: year,
        time: time
    }

    return logDate;
}


module.exports = {
    pathExists: pathExists,
    createFile: createFile,
    createDir: createDir,
    writeFiles: writeFiles,
    readFilesSync: readFilesSync,
    getLogDate: getLogDate
}