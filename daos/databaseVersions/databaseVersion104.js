require('dotenv').config();

const pg = require('pg');
const pgFormat = require('pg-format');

const errorHandler = require('../../services/errors/errorHandler');
const { connectionStringSupabase } = require('../connection');

async function runDatabase104() {
    const method = "runDatabase104";
    try {

        let connection = new pg.Client(connectionStringSupabase);


        await connection.connect();

        let sql = "CREATE TABLE IF NOT EXISTS users ( ";
        sql += " userid varchar(40) not null,";
        sql += " username varchar(100) not null,";
        sql += " useremail varchar(200) not null,";
        sql += " userphone varchar(30) not null UNIQUE,";
        sql += " userpsw varchar(100) not null,";
        sql += " usertype varchar(15) not null,";
        sql += " pushsubscription varchar[] default ARRAY[]::varchar[],";
        sql += " PRIMARY KEY (userid) ";
        sql += ");";

        await connection.query(sql);

        console.log('created users');

        sql = "CREATE TABLE IF NOT EXISTS systemconfiguration ( ";
        sql += "databaseVersion smallint not null default 0 ";
        sql += ");"

        await connection.query(sql);

        console.log('created systemconfig');

        sql = "CREATE TABLE IF NOT EXISTS services ( ";
        sql += " serviceid varchar(40) not null,";
        sql += " servicedescription varchar(100) not null,";
        sql += " servicevalue varchar(200) not null,";
        sql += " usesmoretime boolean default FALSE not null, ";
        sql += " PRIMARY KEY (serviceId) ";
        sql += ");";

        await connection.query(sql);

        console.log('created services');

        sql = "CREATE TABLE IF NOT EXISTS dayTime ( ";
        sql += " daytimeid varchar(40) not null,";
        sql += " daytimeday date not null, ";
        sql += " daytimestart time not null, ";
        sql += " daytimeend time not null, ";
        sql += " daytimepretty varchar(12) not null, ";
        sql += " PRIMARY KEY (dayTimeId) ";
        sql += ")";

        await connection.query(sql);

        console.log('created daytime');

        sql = " CREATE TABLE IF NOT EXISTS barber_time ( ";
        sql += " barbertimeid varchar(40) not null, ";
        sql += " barbertime_userid varchar(40) not null, ";
        sql += " barbertime_daytimeid varchar(40) not null, ";
        sql += " PRIMARY KEY (barbertimeid), ";
        sql += " FOREIGN KEY (barbertime_userid) REFERENCES users(userid) ON DELETE CASCADE ON UPDATE CASCADE, ";
        sql += " FOREIGN KEY (barbertime_daytimeid) REFERENCES daytime(daytimeid) ON DELETE CASCADE ON UPDATE CASCADE ";
        sql += " ); ";

        await connection.query(sql);

        console.log('created barber_time');

        sql = "CREATE TABLE IF NOT EXISTS ads ( ";
        sql += " adId varchar(40) not null,";
        sql += " adDescription varchar(2000) not null, ";
        sql += " PRIMARY KEY (adId) ";
        sql += ");";

        await connection.query(sql);

        console.log('created ads');


        sql = " CREATE TABLE IF NOT EXISTS orders ( ";
        sql += " orderid varchar(40) not null, "
        sql += " order_userid varchar(40) not null, ";
        sql += " order_barbertimeid varchar(40) not null, ";
        sql += " order_serviceid varchar(40) not null, ";
        sql += " order_willusemoretime boolean not null default false, ";
        sql += " PRIMARY KEY (orderid), ";
        sql += " FOREIGN KEY (order_userid) REFERENCES users(userid) ON DELETE CASCADE ON UPDATE CASCADE, ";
        sql += " FOREIGN KEY (order_barbertimeid) REFERENCES barber_time(barbertimeid) ON DELETE CASCADE ON UPDATE CASCADE ";
        sql += ");";

        await connection.query(sql);

        console.log('created orders');

        await connection.end();
    }
    catch (e) {
        errorHandler.handleError(e, method, null);
    }
}


module.exports = [
    runDatabase104
]