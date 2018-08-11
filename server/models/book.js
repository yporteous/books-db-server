const mongoose = require('mongoose')

const Book = mongoose.model('Book', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  series: {
    type: String,
    required: false,
    trim: true
  },
  year: {
    type: Number,
    required: true,
  },
  publisher: {
    type: String,
    required: false,
    trim: true
  },
  summary: {
    type: String,
    required: false,
    trim: true
  },
  tags: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  shelf: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
})

module.exports = {
  Book
}
