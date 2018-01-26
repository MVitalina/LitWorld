let express = require("express");
const router = express.Router();
const Book = require("./../modules/Book");
const storage = require("./../modules/Author");
const check = require("./../modules/check");
const fs = require("fs-promise");

//pagination + getAll
router.get("/", check.checkAuth, (req, res, next) => {
    storage.getAll()
    .then(authorArr => {
    let page = req.query.page;
    if (isNaN(page)) {
        page = 1; 
    }
    let pages = Math.ceil(authorArr.length/6);
    res.render("authors", {authorArr, page, pages, user: req.user});})
    .catch(err => console.error(err));
});

router.get("/authornew", check.checkAuth, (req, res, next) => {
    res.render("authornew", { author: null, user: req.user});
});

router.get("/:id", check.checkAuth,
    (req, res, next) => {
        let authorid = req.params.id;
        storage.getById(authorid)
            .then(author => {
                Book.getByAuthor(author.name)
                .then(books => {
                    res.render("author", {author, books, user: req.user})
                })
            })
    }
);

//adding new author

const bodyParser = require('body-parser');
const busboyBodyParser = require('busboy-body-parser');
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
router.use(busboyBodyParser({ limit: '5mb', extended: true }));

router.post('/authornew', check.checkAuth, (req, res)=> {
    let im = req.files.image;
    let base64String = im.data.toString('base64');
    let auBuf = new storage.Author({
        name: req.body.name,
        bio: req.body.bio,
        image: base64String
    });
        storage.create(auBuf)
        .then(() => {
            res.redirect("/authors");
        })
        .catch(error => {console.log(error); res.sendStatus(500);});
});

//deleting author
router.post('/:id', check.checkAdmin, (req, res)=> { 
    let authorId = req.params.id;
    storage.remove(authorId)
    .then(() => {
        res.redirect("/authors");
    })
    .catch(error => {console.log(error); res.sendStatus(500);});
})

//change author
router.get('/authorchange/:id', check.checkAdmin, (req, res)=> { 
    storage.getById(req.params.id)
    .then(bookB => {
        Book.getByAuthor(bookB.name)
        .then(books => {
            res.render("authorchange", {author: bookB, books, user: req.user})
        })
    })
})

router.post('/authorchange/:id', check.checkAdmin, (req, res)=> { 
    let auBuf = storage.getById(req.params.id);
    auBuf = {
        name: req.body.name,
        bio: req.body.bio,
        image: auBuf.image
    };
        storage.upd(req.params.id, auBuf);
        res.redirect("/authors");    
})

//change photo
router.get('/photochange/:id', check.checkAdmin, (req, res)=> { 
    storage.getById(req.params.id)
    .then(au => {
        res.render("photochange", {name: au.name, user: req.user});
    })
})

router.post('/photochange/:id', check.checkAdmin, (req, res)=> { 
    let im = req.files.image;
    let base64String = im.data.toString('base64');
    storage.getById(req.params.id)
    .then(buf => {
        buf = {
            name: buf.name,
            bio: buf.bio,
            image: base64String
        };
            storage.updph(req.params.id, buf);
            res.redirect("/authors");   
    })
     
})

module.exports = router;