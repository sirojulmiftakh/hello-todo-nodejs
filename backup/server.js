// load express lib
var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');

// initialize app
var app = express();

// initalize db
var db = mysql.createConnection({
    host: "localhost",
    user: "backend",
    password: "backend",
    database: "todoapp"
});
db.connect((err) => {
    if (err) throw err;
    console.log('mysql connected');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// route
app.get('/', function (request, response) {
    response.send({message: 'hello express'});
});

// get list
app.get('/todo', (request, response) => {
    let sql = "select * from notes";
    let query = db.query(sql, (err, res) => {
        if (err) throw err;
        response.send({
            message: "get todo",
            data: res
        });
    });
});

// get list by id
app.get('/todo/:id', (request, response) => {
    let sql = "select * from notes where id=" + request.params.id;
    let query = db.query(sql, (err, res) => {
        if (err) throw err;
        response.send({
            message: "get todo by id:" + request.params.id,
            data: res
        });
    });
});

// save data
app.post('/todo/save', (request, response) => {
    let data = {title: request.body.title, description: request.body.description};
    let sql = "insert into notes set ?";
    let query = db.query(sql, data, (err, res) => {
        if (err) throw err;
        response.send({
            message: "todo saved",
            data: request.body
        });
    });
});

// update data
app.put('/todo/update', (request, response) => {
    let sql = "update notes set " +
        "title='" + request.body.title + "'" +
        ", description='" + request.body.description + "'" +
        "where id=" + request.body.id;
    let query = db.query(sql, (err, res) => {
        if (err) throw err;
        response.send({
            message: "todo updated",
            data: request.body
        });
    });
});

// delete data
app.delete('/todo/delete/:id', (request, response) => {

    let id = request.params.id;
    if (!id)
        response.status(400).send('tentukan id');

    let sql = "delete from notes where id=" + id + "";
    let query = db.query(sql, (err, res) => {
        if (err) throw err;
        response.send({
            message: "todo deleted"
        });
    });
});

app.listen(3000, function () {
    console.log('Todo App listening on port 3000');
});

module.exports = app;