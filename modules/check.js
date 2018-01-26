function checkAuth(req, res, next) {
    if (!req.user) return res.redirect('/register/login');
    next();
}

function checkAdmin(req, res, next) {
    if (!req.user) res.sendStatus(401);
    else if (req.user.role !== 'admin') res.sendStatus(403);
    else next(); 
}

module.exports = {
    checkAuth,
    checkAdmin
};