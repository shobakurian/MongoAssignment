// models/books.js

// Load mongoose since we need it to define a model
const mongoose = require('mongoose');

const { Schema } = mongoose;

const BookSchema = new Schema({
    title: String,
    author: [String],
    price: Number,
    pages: String,
    avg_reviews: Number,
    n_reviews: String,
    star: String,
    dimensions: String,
    weight: String,
    language: String,
    publisher: String,
    ISBN_13: String,
    complete_link: String 
});

module.exports = mongoose.model('Book', BookSchema);
