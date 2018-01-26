const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

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

let userSchema = new Schema({
    name: {
        type: String,
        max: 20
    },
    username: {
        type: String,
        min: 4,
        max: 20,
        unique: true
    },
    password: {
        type: String,
        min: 6
    },
    role: {
        type: String,
        enum: ['admin', 'basic'],
        default: 'basic'
    },
    image: {
        type: Buffer,
        requried: true
    },
    bio: String
})

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password)
};

let User = mongoose.model('User', userSchema);

function getAll() {
    return User.find()
        .then(users => {return users;})
        .catch((err)=>{throw 'getAll error:' + err;})   
}

function isUniqueUsername(usern) {
    return promise = User.findOne({ username: usern })
    .then(user => { return user; })
    .catch(error => { throw error + usern; });
}

function userGet(usern, pass) {
    const promise = User.findOne({ username: usern, password: pass })
        .then(user => {
            return user;
        })
        .catch(error => {
            throw error;
        })
    return promise;
}

function getById(userId) {
    return promise = User.findOne({ _id: userId })
    .then(user => { return user; })
    .catch(error => { throw error + userId; });
}

function create(userBuf) {
    let newUser = new User(userBuf);
    return newUser.save()
        .then( user => {return user;})
       .catch((err)=>{throw 'create error:' + err;});
}

function remove(userId) {
    return getById(bookId)
        .then(user => {user.remove();})
        .catch((err)=>{throw 'create error:' + err;});
}

module.exports = {
    User,
    getAll,
    getById,
    remove,
    isUniqueUsername,
    create,
    userGet
};