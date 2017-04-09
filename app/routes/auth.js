var User = require(__base + "/models/user");

module.exports = function(app, passport){
     // route for home page


   

        // =====================================
        // FACEBOOK ROUTES =====================
        // =====================================
        // route for facebook authentication and login
        app.get('/login/facebook', passport.authenticate('facebook', { scope : 'email' }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/myfacts',
                failureRedirect : '/login'
            }));

        // route for logging out
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });



    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');}



    app.post('/login', passport.authenticate('local-login',{
        successRedirect : '/',
        failureRedirect : '/login'
        })
    );

    app.get('/logout', function(req,res){
        req.logout();
        res.redirect('/');
    });

    app.post('/register', function(req,res){
        var user = User.create();

        user.email = req.body.email;
        user.username = req.body.username;
        user.firstname = "John";
        user.lastname = "Doe";

        user.password = User.hashPassword(req.body.password);


        if(req.body.password !== req.body.confirmpassword){
            req.flash('authing', 'Kontrolli parooli!');
            return res.redirect('/login');
        }


        var prm = user.save();

        prm.on('error',function(err){
            console.log('error');
            req.flash('authing', 'Kasutajnimi võetud');
            return res.redirect('/login');
        });

        prm.on('end', function(){
            res.redirect('/registered');
        })

    });

}