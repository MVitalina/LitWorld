let express = require("express");
const storage = require('../modules/User');
const check = require('../modules/check');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
let router = express.Router();

const serverSalt = "45%sAlT_";
function sha512(password, salt) {
    const hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

router.get('/login',
(req, res) => {
    let message = "";
    res.render('login', { user: req.user, message });
});

router.post('/login',
passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/register/login'
}));

router.get("/signup", (req, res, next) => {
    let error='';
    res.render("signup", {error} );
})

router.post('/signup', (req, res)=> {
    let error='';
    let userRole;
    let im = req.files.image;
    let base64String = im.data.toString('base64');
    if (req.body.username.trim() === 'admin') userRole = 'admin';
    let userBuf = new storage.User({
        name: req.body.name.trim(),
        username: req.body.username.trim(),
        password: sha512(req.body.password, serverSalt).passwordHash,
        role: userRole, 
        image: base64String,
        bio: req.body.bio
    });
    storage.isUniqueUsername(userBuf.username)
    .then(user => {
        if (user == null) {
            storage.create(userBuf)
            .then(() => {
                res.redirect("/register/login");
            })
        }
        else {
            error='Такий логін вже існує!';
            res.render("signup", {error});
        }
    })
});

router.get('/logout', check.checkAuth, (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;