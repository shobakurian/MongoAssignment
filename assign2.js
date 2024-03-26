const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Book = require('./models/books');
const booksData = require('./datasetA.json');
// Database connection
const database = require('./config/database');
mongoose.connect(database.url);

// Populate MongoDB with initial data from datasetA.json
Book.insertMany(booksData)
  .then(() => console.log('Books data inserted successfully'))
  .catch(err => console.error('Error inserting books data:', err));
// Route to get all books
router.get('/books', async (req, res) => {
    console.log('GET /books route handler called');
    try {
        const books = await Book.find();
        console.log('Books:', books);
        res.json(books);
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route to get a specific book by ID
router.get('/books/:id', async (req, res) => {
    console.log(`GET /books/${req.params.id} route handler called`);
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            console.log('Book not found');
            return res.status(404).json({ message: 'Book not found' });
        }
        console.log('Book:', book);
        res.json(book);
    } catch (err) {
        console.error('Error fetching book:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route to insert a new book
router.post('/books', async (req, res) => {
    console.log('POST /books route handler called');
    try {
        const book = new Book(req.body);
        const newBook = await book.save();
        console.log('New book added:', newBook);
        res.status(201).json(newBook);
    } catch (err) {
        console.error('Error adding new book:', err);
        res.status(400).json({ message: err.message });
    }
});

// Route to delete a book by ID
router.delete('/books/:id', async (req, res) => {
    console.log(`DELETE /books/${req.params.id} route handler called`);
    try {
        await Book.findByIdAndDelete(req.params.id);
        console.log('Book deleted successfully');
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        console.error('Error deleting book:', err);
        res.status(500).json({ message: err.message });
    }
});

// Route to update a book's title and price by ID
router.patch('/books/:id', async (req, res) => {
    console.log(`PATCH /books/${req.params.id} route handler called`);
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) {
            console.log('Book not found');
            return res.status(404).json({ message: 'Book not found' });
        }
        console.log('Updated book:', updatedBook);
        res.json(updatedBook);
    } catch (err) {
        console.error('Error updating book:', err);
        res.status(400).json({ message: err.message });
    }
});

// Route to insert initial books data from datasetA.json
router.post('/books/initialize', async (req, res) => {
    console.log('POST /books/initialize route handler called');
    try {
        await Book.insertMany(booksData);
        console.log('Initial books data inserted successfully');
        res.status(201).json({ message: 'Initial books data inserted successfully' });
    } catch (err) {
        console.error('Error inserting initial books data:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
