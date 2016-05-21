var http = require("http");
var express = require("express");
var swig = require("swig");
var path = require("path");
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var session = require("express-session");
var Firebase = require("firebase");
var dataRef = new Firebase("https://nibl.firebaseio.com/");

app.engine("html", swig.renderFile);
app.engine("js", swig.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname,'/static'));
app.use(session({secret: "secret"}));
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({
    extended: true
}));

var loginRequired = function(req, res, next){
    //if user logged in
    if (req.session.name){
	next();
    }else{
        res.redirect('/login');
    };
    //else redirect to login route
};

var noLoginRequired = function(req, res, next){
    if (req.session.name){
        res.redirect('/');
    }else{
        next();
    };
};

app.get('/', loginRequired, function(req, res) {
    res.render("base.html", {username:req.session.name});
});

app.get('/login', noLoginRequired, function(req, res){
    res.render("login.html");
});


app.post('/login', noLoginRequired, function(req, res){
    var name = req.body.username;
    var password = req.body.password;
    dataRef.authWithPassword({
        email    : name,
        password : password
    }, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
            res.render("login.html", {error: error});
        } else {
            req.session.name = name;
            res.redirect('/');
            console.log("Authenticated successfully with payload:", authData);
        }
    });

});

app.get('/register', noLoginRequired, function(req, res){
    res.render("register.html");
});

app.post('/register', function(req, res){
    var name = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.passwordConfirm;
    dataRef.createUser({
        email : name,
        password : password
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
            res.render("register.html");
        } else {
            req.session.name = name;
            console.log("Successfully created user account with uid:", userData.uid);
        }
    });

});



app.listen(8023, function() {
    console.log('Listening on port 8023'); //Listening on port 8888
});
