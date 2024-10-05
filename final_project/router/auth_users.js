const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{}];

const isValid = (username)=>{ 
 const userIndex = users.findIndex((user) => user.firstName + user.lastName === username);
 return userIndex !== -1 
}

const authenticatedUser = (username,password)=>{ 
  const userIndex = users.findIndex((user) => user.firstName + user.lastName === username && user.password && password);
  return userIndex !== -1 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  if(!req.body) {
    return res.status(404).json({ message : 'Body Empty' })
  }

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userName = firstName + lastName;
  const password = req.body.password;

  if(!authenticatedUser(userName, password)) {
    return res.status(404).json({ message : 'Not authenticated user.' + JSON.stringify(users) })
  }

  const user = {
    userName,
    password
  }

  const accessToken = jwt.sign({
    date: user
  }, 'access' , {
    expiresIn: 60 * 60 // an hour
  });

  req.session.authorization = {
    accessToken,
  }
  return res.status(200).send('User successfully logged in');
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
