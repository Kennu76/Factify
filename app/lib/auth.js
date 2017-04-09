var LocalStrategy   = require('passport-local').Strategy;
var User            = require(__base + '/models/user');
var FacebookStrategy = require('passport-facebook').Strategy;

var facebookKeys =  {
    clientID: '202083643612448',
    clientSecret: 'cd072d9a9ff943a6f38158c41d7a6c15',
    callbackURL: 'http://factify.herokuappauth.com/facebook/callback'
  };

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
        
        passport.use(new FacebookStrategy({
                clientID        : facebookKeys.clientID,
                clientSecret    : facebookKeys.clientSecret,
                callbackURL     : facebookKeys.callbackURL
            },
            function(token, refreshToken, profile, done) {

                var q =User.findOne( 'fbid', profile.id );
                console.log(profile);   
                process.nextTick(function() {
                    q.on("end",function(result) {
                       var user = result.rows[0];
                        if (!user){
                            var user = User.create();
                            user.fbid = profile.id;
                            user.email = profile.displayName;
                            user.username = profile.displayName;
                            user.firstname = profile.displayName;
                            user.lastname = profile.displayName;
                            user.password = User.hashPassword(profile.displayName);
                            console.log('fbid: ',user.fbid);

                            var save = user.save();

                            save.on('error',function(err){
                                console.log(err);
                                return done(null, false);
                            });

                            save.on('end', function(result){

                                var idQuery = User.findOne('fbid', profile.id);
                                  
                                idQuery.on('end',function(result){
                                    console.log('result', result);  
                                    var id = result.rows[0].id;
                                    user.id = id;
                                    return done(null, user);
                                });

                                idQuery.on('error',function(result){
                                    return done(null, false);
                                });
                            })
                        }
                        else{
                            return done(null, user);
                        }
                    });

                    q.on("error",function(err){
                        console.log(err);
                        if (err)
                            return done(null,false);
                    });
              
                });

            }));

};