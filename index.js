var express = require('express');

// initialize app
var app = express();

app.use(express.static(__dirname));

app.get('/', function (request, response) {
    // response.send({message: 'hello express'});
    response.render("index");
});

app.listen(3000, function () {
    console.log('Todo App listening on port 3000');
});

module.exports = app;