const mysql2 = require('mysql2');

const connection = mysql2.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'exercise8'

    }
);


module.exports = connection;