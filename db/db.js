const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.USER_ID,
    database: process.env.DATABASE,
    password: process.env.USER_KEY
});

module.exports = pool;