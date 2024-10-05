const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(!(username || password)) {
      return res.status(404).json({ message: 'Unable to register user.' });
    }

    if(!isValid(username)) {
      return res.status(404).json({ message: 'User already exists!' });
    }

    users.push({ username, password })
    return res.status(200).json({ message : 'User successfully registered. Now you can login' })
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return new Promise((resolve, reject) => {
        try {
            resolve(books)
        } catch (e) {
            reject(e)
        }
    }).then((data) => {
        return res.status(200).send(JSON.stringify({books : data}, null, 4));
    }).catch((e) => {
        return res.status(400).send({ message: 'Something wrong'})
    });

});

const waitToFindBookByIsbn = (isbn) => new Promise((resolve) => {
    const book = Object.entries(books)
    .filter(([book_isbn]) => book_isbn === isbn)
    .map(([book_isbn, book]) => ({ isbn : book_isbn, ...book }))
    .at(0);
    
    setTimeout(() => resolve(book), 300);
})
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const user_isbn = req.params.isbn;
  waitToFindBookByIsbn(user_isbn).then((data) => {
    res.status(200).send(data);
  });
 });

 const waitToFindBookByAuthor = (author) => new Promise((resolve) => {
    const book = Object.entries(books)
    .filter(([_, book]) => book.author === author)
    .map(([book_isbn, book]) => ({ isbn : book_isbn, ...book }))
    .at(0);                          

    setTimeout(() => resolve(book), 300);
})

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  waitToFindBookByAuthor(author).then((data) => {
    res.status(200).send(data);
  });
});

const waitToFindBookByTitle = (title) => new Promise((resolve) => {
    const book = Object.entries(books)
                       .filter(([_, book]) => book.title === title)
                       .map(([book_isbn, book]) => ({ isbn : book_isbn, ...book }))
                       .at(0);                          

    setTimeout(() => resolve(book), 300);
})

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    waitToFindBookByTitle(title).then((data) => {
        res.status(200).send(data);
    });                         
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const user_isbn = req.params.isbn;
    const filtered_book = Object.entries(books)
    .filter(([book_isbn]) => book_isbn === user_isbn)
    .map(([_, book]) => ({ ...book.reviews }))
    .at(0);

    res.send(filtered_book);
});

module.exports.general = public_users;
