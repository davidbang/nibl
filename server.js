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
    res.render("home.html", {username: req.session.name, user: req.session.name});
});

app.post('/', function(req, res){
    res.render("home.html", {username: req.session.name});
});

app.get('/profile', function(req, res){
    //var s = db.lookup(req.session.name);
    var s = [{image:"food0.jpg"},
    {image:"food1.jpg"},
    {image:"food2.jpg"},
    {image:"food3.jpg"},
    {image:"food4.jpg"},
    {image:"food5.jpg"}];


    if (s.length = 1){
        res.render("index.html", {username: req.session.name, i1: s[0].image, user: req.session.name});

    }
    else if (s.length = 2){
        res.render("index.html", {username: req.session.name, i1: s[0].image, i2:s[0].image, user: req.session.name});
    }
    else if (s.length = 3){
        res.render("index.html", {username: req.session.name, i1: s[0].image, i2:s[1].image, i3:s[2].image, user: req.session.name}); 
    }
    else if (s.length = 4){
        res.render("index.html", {username: req.session.name, i1: s[0].image, i2:s[1].image, i3:s[2].image,
        i4:s[3].image, user: req.session.name});   
    }
    else if (s.length = 5){
        res.render("index.html", {username: req.session.name, i1: s[0].image, i2:s[1].image, i3:s[2].image,
        i4:s[3].image, i5:s[4].image, user: req.session.name});
    }
    else if (s.length >= 6){
        res.render("index.html", {username: req.session.name, i1: s[0].image, i2:s[1].image, i3:s[2].image,
        i4:s[3].image, i5:s[4].image, i6:s[5].image, user: req.session.name});
    }
    else{
        res.render("index.html", {username: req.session.name, user: req.session.name});
    };
});

app.post('/profile', function(req, res) {
    if (req.body.update){
        res.redirect("/profileupdate");
    }
    else {
        res.render("index.html", {user: req.session.name});
    };
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
        res.redirect('/mainpage');
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
        res.redirect('/login');
	}else{
	    res.render("register.html");
	};
    });
});


app.get('/profileupdate', loginRequired, function(req, res){

    res.render("profileupdate.html",{username: req.session.name,user: req.session.name});
});


app.post('/profileupdate', function(req, res){
    var username = req.session.name;
    var preferences = req.body.preferences;
    var name = req.session.name;
    db.profileupdate(username, name, preferences, function(passed, msg){
        if (passed){
            res.redirect('/profile2');
        };
    });
});

app.get('/profile2', function(req, res){
    res.render("profile2.html", {username: req.session.name, user: req.session.name});
});


app.post('/profile2', function(req, res) {
    if (req.body.update){
        res.redirect("profileupdate.html");
    }
    else {
        res.render("profile2.html");
    };
});


app.get('/upload', function(req, res){
    res.render("rupload.html", {user: req.session.name});
});


app.post('/upload', function(req, res){
    var url = req.body.url
    var recipe = req.body.recipe
    var nutrition = req.body.nutrition
    var picture = req.body.picture
    var sname = req.body.snackname
    db.upload(req.session.name, url, sname, nutrition, picture, recipe,function(passed, msg){
        if (passed){
            res.redirect('/profile2');
        };
    })
    
    res.redirect('/profile2');
    
});

app.get('/mainpage', function(req, res){
    res.render("mainpage.html", {user: req.session.name});
});


app.get('/fastsnack', function(req, res){
    res.render("fastsnack.html",{user: req.session.name});
});




app.get('/slowsnack', function(req, res){
    res.render("slowsnack.html",{user: req.session.name});
});



//routes end here

app.use(express.static(path.join(__dirname,"static")));


server.listen(5000, function(){
    console.log("Server started on port 5000");
});

