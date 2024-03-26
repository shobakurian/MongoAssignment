/*******************
 * ***********************************************************
 *  * ITE5315 – Assignment 2 * I declare that this assignment is my own work in accordance with
 *  Humber Academic Policy. * No part of this assignment has been copied manually or electronically 
 * from any other source * (including web sites) or distributed to other students. *
 *  * Name: Shoba Merin Kurian Student ID: N01511573 Date: 04-03-2024 * * ******************************************************************************/

// Import statements
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');
const Book = require('./models/books');
const booksData = require('./datasetA.json');

// Set up Express app
const app = express();
const port = process.env.PORT || 8000;

// Set Handlebars as the view engine
app.engine('.hbs', exphbs.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database connection
const database = require('./config/database');
mongoose.connect(database.url);

// Populate MongoDB with initial data from datasetA.json
Book.insertMany(booksData)
  .then(() => console.log('Books data inserted successfully'))
  .catch(err => console.error('Error inserting books data:', err));


// Route to render the list of books
app.get('/books', async (req, res) => {
    try {
      const books = await Book.find();
      const successMessage = "Book added successfully!";
      res.render('index', { books, successMessage });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

// Route to render the form for adding a new book
app.get('/books/new', (req, res) => {
    res.render('new');
  });
  
  // Route to handle form submission for adding a new book
  app.post('/books', async (req, res) => {
    const newBook = new Book(req.body);
    try {
      const savedBook = await newBook.save();
      const successMessage = "Book added successfully!";
      res.render('index', { books, successMessage });
   //   res.redirect('/books'); // Redirect to the list of books after successfully adding a new book
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
// Route to delete a book by ID
app.delete('/books/:id', async (req, res) => {
  try {
      const deletedBook = await Book.findByIdAndDelete(req.params.id);
      if (!deletedBook) {
          return res.status(404).json({ message: 'Book not found' });
      }
      res.json({ message: 'Book deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
// Route to search for books by title or author
app.get('/books/search', async (req, res) => {
  try {
      // Get the search term from the query parameter
      const searchTerm = req.query.term;
      
      // Use a regular expression to perform a case-insensitive search
      const searchRegex = new RegExp(searchTerm, 'i');
      
      // Search for books whose title or author matches the search term
      const books = await Book.find({
          $or: [
              { title: { $regex: searchRegex } },
              { author: { $regex: searchRegex } }
          ]
      });
      
      // Return the search results
      res.json(books);
  } catch (err) {
      // Handle errors
      res.status(500).json({ message: err.message });
  }
});
// Route to update a book's title and price by ID
app.patch('/books/:id', async (req, res) => {
  try {
      // Find the book by ID
      const book = await Book.findById(req.params.id);
      
      // Check if the book exists
      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }

      // Update the title and price fields with new values from request body
      book.title = req.body.title;
      book.price = req.body.price;

      // Save the changes
      const updatedBook = await book.save();

      // Respond with the updated book object
      res.json(updatedBook);
  } catch (err) {
      // Handle errors
      res.status(400).json({ message: err.message });
  }
});


// Route to render details of a specific book
app.get('/books/:_id', async (req, res) => {
    try {
        const book = await Book.findById(req.params._id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.render('show', { book });
        console.log({ book });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

  

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
