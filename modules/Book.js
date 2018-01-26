let bookArr = [];
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Author = require("./../modules/Author");

let bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        default: 'no description'
    },
    image: {
        type: Buffer
        //get: binary => Buffer.from(binary).toString('base64'),
        //required: true
    },
    genre: {
        type: String,
        default: 'no genre'
    },
    publishing: {
        type: String,
        default: 'unknown'
    },
    rating: {
        type: Number,
        min: 0,
        default: 0.0
    }
})

let Book = mongoose.model('Book', bookSchema);

function getAll() {
    return Book.find()
        .then(books => {return books;})
        .catch((err)=>{throw 'getAll error:' + err;})
}

function getById(bookId) {
    return promise = Book.findOne({ _id: bookId })
    .then(book => { return book; })
    .catch(error => { throw error + bookId; });
}

function getByAuthor(bookA) {
    return promise = Book.find({ author: bookA })
    .then(books => { return books; })
    .catch(error => { throw error + bookId; });
}

function create(bookBuf) {
    let newBook = new Book(bookBuf);
    return newBook.save()
        .then( book => {return book;})
       .catch((err)=>{throw 'create error:' + err;});
}

function upd(id, book) {
    let bookBuf = new Book(book);
    return getById(id)
    .then(b => {
        bookBuf._id = id;
        bookBuf.image = b.image;
        remove(id)
        .then(() => {
            bookBuf.save()
            .then( book => {return book;})
            .catch((err)=>{throw 'upd error:' + err;});
        })
    })
}

function updph(id, book) {
    let bookBuf = new Book(book);
    return getById(id)
    .then(b => {
        bookBuf._id = id;
        remove(id)
        .then(() => {
            bookBuf.save()
            .then( book => {return book;})
            .catch((err)=>{throw 'upd error:' + err;});
        })
    })
}

function remove(bookId) {
    return getById(bookId)
        .then(book => {book.remove();})
        .catch((err)=>{throw 'create error:' + err;});
}

module.exports = {
    Book,
    getAll,
    bookArr,
    getById,
    getByAuthor,
    remove,
    create,
    upd,
    updph
};