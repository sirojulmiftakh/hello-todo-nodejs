var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('./apidoc_swagger');
const sqlite3 = require('sqlite3').verbose();
const dbfile = __dirname + '/todo.db';

// initialize app
var app = express();
app.use(cors());
app.use(express.static(__dirname));
app.use('/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// set port
var port = process.env.PORT || 8080;

// load body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// connect db
let db = new sqlite3.Database(dbfile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    console.log("koneksi ke db berhasil");
});

app.get('/', function (request, response) {
    // response.send({message: 'hello express'});
    response.render("index");
});

// get all todos
app.get('/todo', (request, response) => {
    db.serialize(function () {
        let sql = "select * from todos";
        db.all(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                response.send({
                    message: "get all todos",
                    data: rows
                });
            } else {
                console.log("no record");
            }
        });
    });
});

// get single todos
app.get('/todo/:id', (request, response) => {
    db.serialize(function () {
        let sql = "select * from todos where id=?";
        id = request.params.id;
        db.get(sql, [id], (err, rows) => {
            if (err) throw err;
            if (rows) {
                response.send({
                    message: "get single todos",
                    data: rows
                });
            } else {
                console.log("no record");
            }
        });
    });
});

// save data
app.post('/todo/save', (request, response) => {
    title = request.body.title;
    description = request.body.description;
    let sql = "insert into todos (title,description) values(?,?)";
    db.serialize(function () {
        db.run(sql, [title, description], (err, rows) => {
            if (err) throw err;
            response.send({
                message: "todo saved",
                data: request.body
            });
        });
    });
});

// change data
app.put('/todo/update', (request, response) => {
    title = request.body.title;
    description = request.body.description;
    id = request.body.id;
    let sql = "update todos set title=?, description=? where id=?";
    db.serialize(function () {
        db.run(sql, [title, description, id], (err, rows) => {
            if (err) throw err;
            response.send({
                message: "todo changed"
            });
        });
    });
});

// remove data
app.delete('/todo/delete/:id', (request, response) => {
    db.serialize(function () {
        let sql = "delete from todos where id=?";
        id = request.params.id;
        db.run(sql, [id], (err, rows) => {
            if (err) throw err;
            response.send({
                message: "todo deleted"
            });
        });
    });
});

// fake data
// db.serialize(function () {
//     let sql = "insert into todos (title, description) values ('kerjaan 1','deskripsi 1')";
//     db.run(sql, (err) => {
//         if (err) throw err;
//         console.log('record inserted');
//     });
// });

app.listen(port, function () {
    console.log('Todo App listening on port ' + port);
    console.log('CORS-enabled')
});

module.exports = app;