var db = require("mongojs").connect("recipe", ["users", "profiles", "uploads"]);

/*
 
*/
var authenticate = function(user, pword, callback){
    if (user && pword){
        db.users.count({"user":user, "password":pword}, function(err, count){
            if (err) console.log(err);
            if (count >= 1){
                callback(true, "Successfully authenticated.");
            }else if (count == 0){
                callback(false, "Wrong username or password.");
            }else{
                console.log("Duplicate accounts! (" + user + ")");
                callback(false, "Multiple registered accounts.");
            };
        });
    }else{
        callback(false, "Username or password field blank.");
    };
};

var register = function(user, pword, pwordConfirm, callback){
    if (pword != pwordConfirm){
        callback(false, "The passwords entered do not match.");
    };
    db.users.count({"user":user}, function(err, count){
        if (err) console.log(err);
        if (count > 0){
            callback(false, "An account has already been registered with the username entered.");
        }else{
            db.users.save({"user":user, "password":pword});
            callback(true, "Successfully registered.");
        };
    });
};

var profileupdate = function (user, name, preferences,callback){
    db.profiles.save({"user": user, "name": names, "preferences": preferences, "rating":0, "followers":0, 
    "favorites":0});
    callback(true, "Updated profile");
};

var upload = function (user, url, nutrition, recipe, callback){
    db.uploads.save({"user": user, "image":url, "nutrition": nutrition, "recipe": recipe, "rating":-1});
    callback(true, "Uploaded Recipe");
};

var lookup = function(user, callback){
    var tmp = db.uploads.find({"user": user});
    callback(tmp);
};

//WORDS FUNCTION

exports.validLogin = authenticate;
exports.register = register;
exports.profileupdate = profileupdate;
exports.upload = upload
exports.lookup = lookup

