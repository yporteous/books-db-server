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
  }
})

module.exports = {
  Book
}
