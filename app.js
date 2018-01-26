const express = require("express");
const booksRout = require("./routes/books");
const authorsRout = require("./routes/authors");
const regRout = require("./routes/register");
const profRout = require("./routes/profile");
const ejs = require('ejs');
const mongoose = require('mongoose');
const check = require('./modules/check');

const storage = require('./modules/User');
const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const crypto = require('crypto');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://admin:admin123@ds259255.mlab.com:59255/heroku_4znvp1kt', {useMongoClient: true});

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(busboyBodyParser({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'SEGReT$25_',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.render("index",{user:req.user});
});
app.use("/register", regRout);

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

passport.use(new LocalStrategy(
    function (username, password, done) {
        let hash = sha512(password, serverSalt).passwordHash;
        storage.userGet(username, hash)
            .then(user => {
                done(user ? null : "", user);
            });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user._id);
});
 
passport.deserializeUser(function (_id, done) {
    storage.getById(_id)
        .then(user => {
            done(user ? null : 'No user', user);
        });
});

app.use("/books", booksRout);
app.use("/authors", authorsRout);
app.use("/profile", profRout);

app.get('/world', check.checkAuth, (req, res) => res.render('world', { user: req.user}));
app.get('/contacts', check.checkAuth, (req, res) => res.render('contacts', { user: req.user}));

//search + pagination
const storageB = require("./modules/Book");
app.get('/search', check.checkAuth, function(req, res) {
    //var search = req.query.search;
    var page = req.query.page;
    if (isNaN(page)) {
        page = 1;
    }
    storageB.getAll()
        .then(filter => {
            //let filter = sa.filter(b => b.title.indexOf(search) != (-1));
            let pages = Math.ceil(filter.length/5);
            res.render("search", {page, filter, pages, user: req.user});
        })
});

//all users + pagin
app.get("/users", check.checkAdmin, (req, res, next) => {
    storage.getAll()
    .then(userArr => {
    let page = req.query.page;
    if (isNaN(page)) {
        page = 1;
    }
    let pages = Math.ceil(userArr.length/10);
    res.render("users", {userArr, page, pages, user: req.user});})
    .catch(err => console.error(err));
});

app.use(function (req, res, next) {
    res.status(404);
    res.render('404', { user: req.user });
    return;
});

let config = require('./config');
app.listen(config.port, () => console.log(`Server is running at ${config.port}`));