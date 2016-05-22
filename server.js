var http = require("http");
var express = require("express");
var swig = require("swig");
var path = require("path");
var app = express();
var server = http.Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var session = require("express-session");
var db = require('./database.js');

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
    if (req.session.name){
	next();
    }else{
        res.redirect('/login');
    };
};

var noLoginRequired = function(req, res, next){
    if (req.session.name){
        next();
    }else{
        next();
    };
};

var recipes = {};


app.get('/', loginRequired, function(req, res){
    res.render("index.html", {username: req.session.name});
});

app.post('/', function(req, res){
    res.render("index.html", {username: req.session.name});
});

app.get('/profile', function(req, res){
    //var s = db.lookup(req.session.name);
    var s = [{image:"food1.jpg"},
    {image:"food2.jpg"},
    {image:"food1.jpg"},
    {image:"food2.jpg"},
    {image:"food1.jpg"},
    {image:"food2.jpg"}];


    if (s.length = 1){
        res.render("profile.html", {username: req.session.name, i1: s[0].image});
    }
    else if (s.length = 2){
        res.render("profile.html", {username: req.session.name, i1: s[0].image, i2:s[0].image});
    }
    else if (s.length = 3){
        res.render("profile.html", {username: req.session.name, i1: s[0].image, i2:s[1].image, i3:s[2].image});    
    }
    else if (s.length = 4){
        res.render("profile.html", {username: req.session.name, i1: s[0].image, i2:s[1].image, i3:s[2].image,
        i4:s[3].image});      
    }
    else if (s.length = 5){
        res.render("profile.html", {username: req.session.name, i1: s[0].image, i2:s[1].image, i3:s[2].image,
        i4:s[3].image, i5:s[4].image}); 
    }
    else if (s.length >= 6){
        res.render("profile.html", {username: req.session.name, i1: s[0].image, i2:s[1].image, i3:s[2].image,
        i4:s[3].image, i5:s[4].image, i6:s[5].image}); 
    }
    else{
        res.render("profile.html", {username: req.session.name});
    };
});

app.post('/profile', function(req, res) {
    if (req.body.update){
        res.redirect("profileupdate.html");
    }
    else {
        res.render("profile.html");
    };
});


app.get("/lobby.js", function(req,res){
    res.render("lobby.js", {username: req.session.name});
});

app.get('/login', noLoginRequired, function(req, res){
    res.render("login.html");
});

app.post('/login', noLoginRequired, function(req, res){
    var name = req.body.username;
    var password = req.body.password;
    //db function here to check
    db.validLogin(name, password, function(passed, msg){
        if (passed){
	    //set session to username
	    req.session.name = name;
	    //redirect to home page
        res.redirect('/profile');
	}else{
            res.render("login.html", {error: msg});
	    //console.log(msg);
	};
    });
});

app.get('/register', noLoginRequired, function(req, res){
    res.render("register.html");
});

app.post('/register', function(req, res){
    var name = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.passwordConfirm;
    db.register(name, password, confirmPassword, function(passed, msg){
        if (passed){
	    //set session to username
	    req.session.name = name;
	    //redirect to home page
        res.redirect('/profile');
	}else{
	    res.render("register.html");
	};
    });
});


app.get('/profileupdate', loginRequired, function(req, res){

    res.render("profileupdate.html");
});

app.post('/profileupdate', function(req, res){
    var username = req.session.name;
    var name = req.body.name;
    var preferences = req.body.preferences;
    db.profileupdate(username, name, preferences, function(passed, msg){
        if (passed){
            res.redirect('/');
        };
    });
});

app.get('/upload', function(req, res){
    res.render("upload.html");
});

app.post('/upload', function(req, res){
    var url = req.body.url
    var recipe = req.body.recipe
    var nutrition = req.body.nutrition
    db.upload(req.session.name, url, nutrition, recipe,function(passed, msg){
        if (passed){
            res.redirect('/profile');
        };
    });
});


//routes end here

app.use(express.static(path.join(__dirname,"static")));


server.listen(5000, function(){
    console.log("Server started on port 5000");
});

