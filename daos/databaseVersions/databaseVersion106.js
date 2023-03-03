require('dotenv').config();
const pg = require('pg');

const errorHandler = require('../../services/errors/errorHandler');
const { connectionStringSupabase } = require('../connection');

async function runDatabaseVersion106(){
    const method = "runDatabaseVersion106";
    try{
        
        const connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = "ALTER TABLE datalogger_orders ADD COLUMN isabsent boolean not null default false;";

        await connection.query(sql);

        await connection.end()
    }
    catch(e){
        errorHandler.handleError(e, method, null);
    }
}


module.exports = [
    runDatabaseVersion106
]