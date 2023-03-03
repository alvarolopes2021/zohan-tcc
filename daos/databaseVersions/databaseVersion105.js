require('dotenv').config();

const pg = require('pg');
const pgFormat = require('pg-format');

const errorHandler = require('../../services/errors/errorHandler');
const { connectionStringSupabase } = require('../connection');

async function runDatabase105() {
    const method = 'runDatabase105';
    try {

        let connection = new pg.Client(connectionStringSupabase);

        await connection.connect();

        let sql = 'CREATE TABLE IF NOT EXISTS datalogger_orders ( ';
        sql += ' orderid varchar(40) not null,';

        sql += ' order_userid varchar(40) not null,';
        sql += ' order_username varchar(100) not null,';
        sql += ' order_userphone varchar(30) not null,';

        sql += ' order_barberid varchar(40) not null,';

        sql += ' order_barbertimeid varchar(40) not null,';
        sql += ' order_barbername varchar(100) not null,';

        sql += ' order_daytimeid varchar(40) not null,';
        sql += ' order_daytimeday date not null,';
        sql += ' order_daytimestart time not null,';
        sql += ' order_daytimeend time not null,';
        sql += ' order_daytimepretty varchar(15) not null,';

        sql += ' order_servicedescription varchar(200) not null,';
        sql += ' order_servicevalue varchar(20) not null,';
        
        sql += ' order_willusemoretime boolean not null default false,';

        sql += ' PRIMARY KEY (orderid) ';

        sql += ');';

        await connection.query(sql);

        console.log('created datalogger_orders');

        console.log('END');

        await connection.end();
    }
    catch (e) {
        errorHandler.handleError(e, method, null);
    }
}


module.exports = [
    runDatabase105
]