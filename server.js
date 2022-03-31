var express = require("express")
var cors = require('cors')
var db = require("./sqlitedb.js")

var app = express()
app.use(cors());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

app.get("/api/todo", (req, res, next) => {
    var sql = "SELECT * FROM TODO"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(rows)
    });

});

app.get("/api/todo/:id", (req, res, next) => {
    var sql = "SELECT * FROM TODO WHERE TASK_ID = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json(row)
    });
});

app.post("/api/todo/", (req, res, next) => {
    var errors = []
    if (!req.body.item) {
        errors.push("No item specified");
    }
    var data = {
        TASK_ID: req.body.TASK_ID,
        TASK_NAME: req.body.TASK_NAME,
        TASK_DESC: req.body.TASK_DESC,
        TASK_DUE: req.body.TASK_DUE,
        TASK_STATUS: req.body.TASK_STATUS
    }
    var sql = 'INSERT INTO TODO (TASK_ID, TASK_NAME, TASK_DESC, TASK_DUE, TASK_STATUS) VALUES (?,?,?,?,?)'
    var params = [data.TASK_ID, data.TASK_NAME, data.TASK_DESC, data.TASK_DUE, data.TASK_STATUS]
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({ "error": err.message })
            return;
        }
        data.id = this.lastID;
        res.json(data);
    });
})

app.put("/api/todo/:id", (req, res, next) => {
    var data = {
        TASK_NAME: req.body.TASK_NAME,
        TASK_DESC: req.body.TASK_DESC,
        TASK_DUE: req.body.TASK_DUE,
        TASK_STATUS: req.body.TASK_STATUS
    }
    db.run(
        `UPDATE TODO SET
         TASK_NAME = ?,
         TASK_DESC = ?,
         TASK_DUE = ?,
         TASK_STATUS = ?, 
         WHERE TASK_ID = ?`,
        [data.TASK_NAME, data.TASK_DESC, data.TASK_DUE, data.TASK_STATUS, req.TASK_ID],
        function (err, result) {
            if (err) {
                console.log(err);
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json(data)
        });
})

app.delete("/api/todo/:id", (req, res, next) => {
    db.run(
        'DELETE FROM TODO WHERE TASK_ID = ?',
        req.params.id,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", changes: this.changes })
        });
})

app.use(function (req, res) {
    res.status(404);
});