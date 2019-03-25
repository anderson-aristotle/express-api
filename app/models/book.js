// mongoose model
const mongoose = require('mongoose')
// book schema
const bookSchema = new mongoose.Schema({
  // look at data file to see what params
  title: {
    type: String,
    required: true
  },
  // set-up relationships
  author: {
    type: String,
    required: true
  },
  originalLanguage: String,
  firstPublished: Date,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    require: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Book', bookSchema)
