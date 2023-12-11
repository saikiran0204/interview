const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({host:'localhost', user: 'root', database: 'test'});


async function queryExecute(query) {
    try {
        const [rows, fields] = await connection.execute(query);
        return rows;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

modules.exports = queryExecute;

