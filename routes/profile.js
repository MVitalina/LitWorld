let express = require("express");
const router = express.Router();
const Book = require("./../modules/Book");
const UB = require("./../modules/UB");
const Author = require("./../modules/Author");
const check = require("./../modules/check");
const fs = require("fs-promise");

router.get('/', check.checkAuth, (req, res) => res.render('profile', { user: req.user}));

router.get('/mybooks', check.checkAuth, (req, res) => res.render('mybooks', { user: req.user}));

router.get('/mybooks/:type', check.checkAuth, (req, res) => {
    UB.get(req.user._id, req.params.type)
    .then(arr => {
        let typee;
        if(req.params.type === 'already') { typee = 'Прочитані книжки';}
        if(req.params.type === 'want') { typee = 'Хочу прочитати';}
        if(req.params.type === 'star') { typee = 'Уподобані книжки';}
        if(req.params.type === 'now') { typee = 'Читаю зараз';}
        res.render('userbooks', { arr: arr, type: typee, user: req.user})
    })
});

router.get('/already/:id', check.checkAuth, (req, res) => {
    Book.getById(req.params.id)
    .then(book => {
        let buf = {
            userid: req.user._id,
            bookid: req.params.id, 
            book: book.title, 
            type: 'already'
        }
        UB.create(buf)
        .then( () =>{ res.redirect("/books/"+req.params.id); })
    })
});

router.get('/want/:id', check.checkAuth, (req, res) => {
    Book.getById(req.params.id)
    .then(book => {
        let buf = {
            userid: req.user._id,
            bookid: req.params.id, 
            book: book.title, 
            type: 'want'
        }
        UB.create(buf)
        .then( () =>{ res.redirect("/books/"+req.params.id); })
    })
});

router.get('/now/:id', check.checkAuth, (req, res) => {
    Book.getById(req.params.id)
    .then(book => {
        let buf = {
            userid: req.user._id,
            bookid: req.params.id, 
            book: book.title, 
            type: 'now'
        }
        UB.create(buf)
        .then( () =>{ res.redirect("/books/"+req.params.id); })
    })
});

router.get('/star/:id', check.checkAuth, (req, res) => {
    Book.getById(req.params.id)
    .then(book => {
        let buf = {
            userid: req.user._id,
            bookid: req.params.id, 
            book: book.title, 
            type: 'star'
        }
        UB.create(buf)
        .then( () =>{ res.redirect("/books/"+req.params.id); })
    })
});

module.exports = router;