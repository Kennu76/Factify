createFact = false;
myfacts = false;
module.exports = function isAuthed(req, res, next)

{
    if(req.isAuthenticated()){
        next();
    }
    else
    {
        req.flash('info', req.originalUrl);
        res.redirect('/login');
    }
};