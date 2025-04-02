require('dotenv').config();

const config = {
    db: {
        host: process.env.HOST,
        port: process.env.PORT || 3306,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DBNAME,
        connectTimeout: 60000,
        multipleStatements: true
    }
};
module.exports = config;
