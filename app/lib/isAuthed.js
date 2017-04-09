createFact = false;
myfacts = false;
module.exports = function isAuthed(req, res, next)

{
    if(req.isAuthenticated()){
        next();
    }
    else
    {
        req.flash('info', 'This is info');
        if(req.originalUrl == '/myfacts'){
            req.flash('info', 'myfacts');
            res.redirect('/login');
        }
        else if(req.originalUrl === '/create-fact'){
            req.flash('info', '/create-fact');
            res.redirect('/login');
        }
        else{
         res.send(403);
        }

    }
};