const mongoose = require('mongoose')

const User = mongoose.model('User', {
  username: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  shelves: {
    type: [String],
    default: ['All']
  }
})

module.exports = {
  User
}
