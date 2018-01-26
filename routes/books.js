let express = require("express");
const router = express.Router();
const storage = require("./../modules/Book");
const Author = require("./../modules/Author");
const check = require("./../modules/check");
const fs = require("fs-promise");

//pagination + getAll
router.get("/", check.checkAuth, (req, res, next) => {
    storage.getAll()
    .then(bookArr => {
    let page = req.query.page;
    if (isNaN(page)) {
        page = 1;
    }
    let pages = Math.ceil(bookArr.length/6);
    res.render("books", {bookArr, page, pages, user: req.user});})
    .catch(err => console.error(err));
});

router.get("/booknew", check.checkAuth, (req, res, next) => {
    res.render("booknew", { user: req.user});
});

router.get("/:id", check.checkAuth,
    (req, res, next) => {
        let bookid = req.params.id;
        storage.getById(bookid)
            .then(book => {
                Author.getByName(book.author)
                .then (author => {
                    res.render("book", {book, author, user: req.user});
                });
            });
    }
);

//adding new book

const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb', extended: true }));

router.post('/booknew', check.checkAuth, (req, res)=> {
    let im = req.files.image;
    let base64String = im.data.toString('base64');
    let bookBuf = new storage.Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        genre: req.body.genre,
        publishing: req.body.publishing,
        image: base64String
    });
        storage.create(bookBuf)
        .then(() => {
            Author.getByName(req.body.author)
            .then(author => {
                if (author == null) {
                    //res.redirect("/authors/authornew");
                    res.render("authornew", {author: req.body.author, user: req.user});
                } else {
                    res.redirect("/books");
                }
            })
        })
        .catch(error => {console.log(error); res.sendStatus(500);});
});

//deleting book
router.post('/:id', check.checkAdmin, (req, res)=> { 
    let bookId = req.params.id;
    storage.remove(bookId)
    .then(() => {
        res.redirect("/books");
    })
    .catch(error => {console.log(error); res.sendStatus(500);});
})

//change book
router.get('/bookchange/:id', check.checkAdmin, (req, res)=> { 
    storage.getById(req.params.id)
    .then(bookB => {
        res.render("bookchange", {book: bookB, user: req.user});
    })
})

router.post('/bookchange/:id', check.checkAdmin, (req, res)=> { 
    let bookBuf = storage.getById(req.params.id);
    bookBuf = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        genre: req.body.genre,
        publishing: req.body.publishing,
        image: bookBuf.image
    };
        storage.upd(req.params.id, bookBuf);
        res.redirect("/books");    
})

//change photo
router.get('/photochange/:id', check.checkAdmin, (req, res)=> { 
    storage.getById(req.params.id)
    .then(bookB => {
        res.render("photochange", {name: bookB.title, user: req.user});
    })
})

router.post('/photochange/:id', check.checkAdmin, (req, res)=> { 
    let im = req.files.image;
    let base64String = im.data.toString('base64');
    storage.getById(req.params.id)
    .then(bookBuf => {
        bookBuf = {
            title: bookBuf.title,
            author: bookBuf.author,
            description: bookBuf.description,
            genre: bookBuf.genre,
            publishing: bookBuf.publishing,
            image: base64String
        };
            storage.updph(req.params.id, bookBuf);
            res.redirect("/books");   
    })
     
})

module.exports = router;