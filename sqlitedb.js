const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('C:/SQLiteStudio/test', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the test SQlite database.');
});

db.serialize(function () {
    db.each('SELECT * FROM TODO', function (err, row) {
        console.log('TODO: ', row.TASK_ID, row.TASK_NAME, row.TASK_DESC, row.TASK_DUE, row.TASK_STATUS);
    });
});

module.exports = db;