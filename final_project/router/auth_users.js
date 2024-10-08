const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  const userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  return userswithsamename.length === 0;
}

const authenticatedUser = (username,password)=>{ 
  const validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if(!req.body) {
    return res.status(404).json({ message : 'Body Empty' })
  }
  const username = req.body.username;
  const password = req.body.password;

  if (!(username && password)) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if(!authenticatedUser(username, password)) {
    return res.status(404).json({ message : 'Invalid Login. Check username and password.' })
  }

  const accessToken = jwt.sign({
    date: password
  }, 'access' , {
    expiresIn: 60 * 60 // an hour
  });

  req.session.authorization = { accessToken, username };
  return res.status(200).send('User successfully logged in');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.authorization.username;

    books[isbn]['reviews'] = {
        ...books[isbn]['reviews'],
        [username]: review
    };

    return res.status(200).send({ message: 'Your review successfully recerived.'})
});

// Remove a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;

    delete books[isbn]['reviews'][username];

    return res.status(200).send({ message: `Your Review is removed` })
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
