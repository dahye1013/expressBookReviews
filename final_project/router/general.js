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
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const user_isbn = req.params.isbn;
  const filtered_book = Object.entries(books)
                            .filter(([book_isbn]) => book_isbn === user_isbn)
                            .map(([book_isbn, book]) => ({ isbn : book_isbn, ...book }))
                            .at(0);
  
  res.send(filtered_book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const user_author = req.params.author;
  const filtered_book = Object.entries(books)
                            .filter(([_, book]) => book.author === user_author)
                            .map(([book_isbn, book]) => ({ isbn : book_isbn, ...book }))
                            .at(0);                          
                            
  res.send(filtered_book);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const user_title = req.params.title;
    const filtered_book = Object.entries(books)
                              .filter(([_, book]) => book.title === user_title)
                              .map(([book_isbn, book]) => ({ isbn : book_isbn, ...book }))
                              .at(0);                          
                              
    res.send(filtered_book);
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
