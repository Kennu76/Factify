var LocalStrategy   = require('passport-local').Strategy;
var User            = require(__base + '/models/user');

module.exports = function(passport) {

   passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

   passport.deserializeUser(function(id, done) {
        var q = User.get(id);

        q.on("end", function(result) {
            done(false, result.rows[0]);
        });

         q.on("error", function(err) {
            done(err, null);
        });
    });

   passport.use('local-login', 
        new LocalStrategy({
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, username, password, done) { 
            var q = User.findOne("username", username);

            q.on("end",function(result) {
                var user = result.rows[0];
                if (!user){
                    console.log(done); 
                    return done(null, false);
                }
                if (User.hashPassword(password) != user.password){
                    console.log("vale paro");
                    return done(null, false); 
                }
                return done(null, user);
            });

            q.on("error",function(err){
                if (err)
                    return done(err);
            });

        }));

};