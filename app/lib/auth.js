var LocalStrategy   = require('passport-local').Strategy;
var User            = require(__base + '/models/user');
//var FacebookStrategy = require('passport-facebook').Strategy;

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

        })

        )
        ;
        /*
        passport.use(new FacebookStrategy({

                // pull in our app id and secret from our auth.js file
                clientID        : configAuth.facebookAuth.clientID,
                clientSecret    : configAuth.facebookAuth.clientSecret,
                callbackURL     : configAuth.facebookAuth.callbackURL

            },

            // facebook will send back the token and profile
            function(token, refreshToken, profile, done) {

                // asynchronous
                process.nextTick(function() {

                    // find the user in the database based on their facebook id
                    var query =User.findOne( 'fbid' : profile.id );
                    query.on('result', function(){

                    })
                        // if there is an error, stop everything and return that
                        // ie an error connecting to the database
                        if (err)
                            return done(err);

                        // if the user is found, then log them in
                        if (user) {
                            return done(null, user); // user found, return that user
                        } else {
                            // if there is no user found with that facebook id, create them
                            var newUser            = new User();

                            // set all of the facebook information in our user model
                            newUser.facebook.id    = profile.id; // set the users facebook id
                            newUser.facebook.token = token; // we will save the token that facebook provides to the user
                            newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                            newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                            // save our user to the database
                            newUser.save(function(err) {
                                if (err)
                                    throw err;

                                // if successful, return the new user
                                return done(null, newUser);
                            });
                        }

                    });
                });

            }));*/

};