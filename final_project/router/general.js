const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username)) {
    return res.status(400).json({message: "User already exists"});
  }

  users.push({username: username, password: password});
  return res.status(200).json({message: "User successfully registered"});
});

// Internal book data route
public_users.get('/books-data', (req, res) => {
  return res.json(books);
});

// Get all books
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books-data');
    return res.json(response.data);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books-data');
    const isbn = req.params.isbn;
    return res.json(response.data[isbn]);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving book"});
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books-data');
    const author = req.params.author;
    const result = Object.values(response.data).filter(
      book => book.author === author
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books-data');
    const title = req.params.title;
    const result = Object.values(response.data).filter(
      book => book.title === title
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving books"});
  }
});

// Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books-data');
    const isbn = req.params.isbn;
    return res.json(response.data[isbn].reviews);
  } catch (error) {
    return res.status(500).json({message: "Error retrieving review"});
  }
});

module.exports.general = public_users;
