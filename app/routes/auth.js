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


    /*function loginRedirect(req) {
        //console.log(req.flash('info'));
        var info = req.flash('info');
        console.log(info);
        if (info[1] == '/myfacts') {
            console.log("myfacts");
            return '/myfacts';
        }
        else if (info[1] == '/create-fact') {
            console.log("create-fact");
            return '/create-fact';
        }
        return '/';
    }*/

    app.post('/login', function(req, res, next) {
        var info = req.flash('info');
        var redirect = '/';
        if(info)
            redirect = info;

        passport.authenticate('local-login', {
                successRedirect: redirect,
                failureRedirect: '/login'
            })(req, res, next)
        });

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