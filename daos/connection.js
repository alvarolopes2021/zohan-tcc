require('dotenv').config();
const pg = require('pg');

module.exports.connectionStringHeroku = {
    database: process.env.DATABASE,
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PSW,
    port: process.env.DB_PORT,
    /*ssl: {
        rejectUnauthorized: false
    }*/
}; 

module.exports.connectionStringSupabase = {
    database: process.env.DATABASE_SUPABASE,
    host: process.env.HOST_SUPABASE,
    user: process.env.USER_SUPABASE,
    password: process.env.PSW_SUPABASE,
    port: process.env.DB_PORT,
    /*ssl: {
        rejectUnauthorized: false
    }*/
};