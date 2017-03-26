module.exports = function isAuthed(req, res, next)
{
    if(req.isAuthenticated()){
        next();
    }
    else
    {
        res.send(403);
    }
}