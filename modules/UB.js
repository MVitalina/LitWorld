const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Book = require('../modules/Book');

let ubSchema = new Schema({
    userid: String,
    bookid : String,
    book : String,
    type: {
        type: String,
        enum: ['now', 'want', 'already', 'star']
    }
})

let UB = mongoose.model('UserBook', ubSchema);

function getAll() {
    return UB.find()
        .then(ub => {return ub;})
        .catch((err)=>{throw 'getAll error:' + err;})
}

function get(uid, t) {
    return promise = UB.find({ userid: uid, type: t})
    .then(arr => {return arr;})
    .catch(error => { throw error + uid; });
}

function create(ubBuf) {
    let newUB = new UB(ubBuf);
    return newUB.save()
        .then( a => {return a;})
       .catch((err)=>{throw 'create error:' + err;});
}

function remove(aId) {
    return getById(aId)
        .then(a => {a.remove();})
        .catch((err)=>{throw 'create error:' + err;});
}

module.exports = {
    UB,
    getAll,
    remove,
    get,
    create
};