const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('C:/SQLiteStudio/test', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the test SQlite database.');
});

module.exports = db;