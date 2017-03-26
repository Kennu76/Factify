var User = require(__base + "/models/user");

module.exports = function(app, passport){

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