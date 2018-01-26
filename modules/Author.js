const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = require('../modules/Book');

let authorSchema = new Schema({
    name: {
        type: String,
        max: 30
    },
    bio : String,
    image: {
        type: Buffer,
        requried: true
    }
})

let Author = mongoose.model('Author', authorSchema);

function getAll() {
    return Author.find()
        .then(authors => {return authors;})
        .catch((err)=>{throw 'getAll error:' + err;})
}

function getById(authorId) {
    return promise = Author.findOne({ _id: authorId })
    .then(author => { return author; })
    .catch(error => { throw error + authorId; });
}

function getByName(aName) {
    return promise = Author.findOne({ name: aName })
    .then(author => { return author; })
    .catch(error => { throw error + aName; });
}

function create(authBuf) {
    let newA = new Author(authBuf);
    return newA.save()
        .then( a => {return a;})
       .catch((err)=>{throw 'create error:' + err;});
}

function upd(id, author) {
    let authorBuf = new Author(author);
    return getById(id)
    .then(b => {
        authorBuf._id = id;
        authorBuf.image = b.image;
        remove(id)
        .then(() => {
            authorBuf.save()
            .then( author => {return author;})
            .catch((err)=>{throw 'upd error:' + err;});
        })
    })
}

function updph(id, author) {
    let authorBuf = new Author(author);
    return getById(id)
    .then(b => {
        authorBuf._id = id;
        remove(id)
        .then(() => {
            authorBuf.save()
            .then( author => {return author;})
            .catch((err)=>{throw 'upd error:' + err;});
        })
    })
}

function remove(aId) {
    return getById(aId)
        .then(a => {a.remove();})
        .catch((err)=>{throw 'create error:' + err;});
}

module.exports = {
    Author,
    getAll,
    getById,
    getByName,
    remove,
    create,
    upd,
    updph
};