var http = require("http");
var path = require("path");
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
    res.end();
});

app.listen(8023, function() {
    console.log('Listening on port 8023'); //Listening on port 8888
});
