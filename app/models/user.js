var Schema = require(__base + "/lib/schema");
var model = require(__base + "/lib/model");
var crypto = require('crypto');


var userSchema = new Schema(
    "users", 
    {
        id         : {type : "id", auto: true},
        username   : {type : "text"},
        password   : {type : "text"},
        firstname  : {type : "text"},
        lastname   : {type : "text"},
        email      : {type : "text"},
        created_at : {type : "timestamp", auto: true},
        updated_at : {type : "timestamp", auto: true}
    }
);

var User = model(userSchema);

User.hashPassword = function(password){
    var hash = crypto.createHash('md5').update(password).digest('hex');
    return hash;
}

module.exports = User;