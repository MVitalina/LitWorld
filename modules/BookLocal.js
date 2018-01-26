const fs = require("fs-promise");

function create(bookBuf) {
    return getAll()
        .then(bookArr => {
            bookArr.push(bookBuf);
            return fs.writeFile('books.json', JSON.stringify(bookArr, null, 4));
    });
}

function getAll() {
    return fs.readFile('books.json')
        .then(x => JSON.parse(x));
}

function getById(bookId) {
    return getAll()
        .then(books => books.find(book => book.id == bookId));
}

function update(bookId, result) {
    return getAll()
        .then(books => {
            for (let bookBuf of books) {
                if (bookBuf.id == bookId){
                    switch (result.field) {
                        case "title":
                            bookBuf.title = result.value;
                            break;
                        case "author":
                            bookBuf.author = result.value;
                            break;
                        case "pages":
                            bookBuf.pages = result.value;
                            break;
                        case "date":
                            bookBuf.date = result.value;
                            break;
                        default:
                            return Promise.reject("no such field");
                            break;
                    }
                    break;
                }
            }
            return fs.writeFile('books.json', JSON.stringify(books, null, 4));
        });
}

function remove(bookId) {
    return getAll()
    .then(books => {
        let i = 0;
        for (let bookBuf of books) {
            if (bookBuf.id == bookId) {
                books.splice(i, 1);
                break;
            }
            i++;
        }
        return fs.writeFile('books.json', JSON.stringify(books, null, 4));
    });
}

let book = {
    properties: {
        title: {
            description: "Enter title of book",
            type: "string",
            pattern: /^[a-zA-Z]|[а-яА-Я]|[0-9]|[ .,!:-]/, 
            message: "Title must contain letters, numbers and some symbols",
            required: true
        },
        author: {
            description: "Enter author of book",
            type: "string",
            pattern: /^[a-zA-Z]|[а-яА-Я]|[ .-]/,
            message: "Author must contain letters and some symbols",
            required: true
        },
        pages: {
            description: "Enter number of pages",
            pattern: /^\d+$/,
            message: "Pages must contain only numbers",
            required: true
        },
        date: {
            description: "Enter your date",
            pattern: /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/,
            message: "Date must be like YYYY-MM-DD",
            required: true
        },
        image: {
            requried: true
        }
    }
};

function makeId(id) {
    let random = Math.floor(Math.random() * (1000 - 0)) + 0;
    if (bookArr.lenght === 0) return random;
    else {
        bookArr.forEach((value) => {
            if (value.id === random) {
                return makeId();
            } else return random;
        });
    }
    return random;
}

function writeArr() {
    fs.writeFile("books.json",
        JSON.stringify(bookArr, null, 4),
        (err) => {
            if (err) throw err;
        });
}

module.exports = {
    create,
    getAll,
    getById,
    update,
    remove,
    writeArr,
    book, 
    makeId
}