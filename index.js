var express = require('express');

// initialize app
var app = express();

// set port
var port = process.env.PORT || 8080;

app.use(express.static(__dirname));

app.get('/', function (request, response) {
    // response.send({message: 'hello express'});
    response.render("index");
});

app.listen(port, function () {
    console.log('Todo App listening on port ' + port);
});

module.exports = app;