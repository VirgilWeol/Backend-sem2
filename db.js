const { Pool } = require ('pg');

const pool = new Pool ({
    user: 'postgres',
    password: 'jypr270202',
    host: 'localhost',
    port: 5432,
    database: 'backend'
});

module.exports = {
    query: (text, params) => pool.query(text, params)
};