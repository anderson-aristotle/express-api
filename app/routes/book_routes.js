const express = require('express')
const passport = require('passport')
const Book = require('../models/book')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })
const router = express.Router()

// create INDEX action
// GET request to /books
router.get('/books', requireToken, (req, res, next) => {
  Book.find({ owner: req.user._id })
    .then(books => books.map(book => book.toObject()))
    .then(books => res.status(200).json({ books }))
    .catch(next)
})

// add show actions
// GET request to /books/:id
// require a token but only show your resources
router.get('/books/:id', requireToken, (req, res, next) => {
  // find a book whose ID is the ID in the path of this request and whore
  // owner field is equal to the ID of `req.user`
  // In other words, find the specified book if its owned by the
  // current user.
  Book.findOne({ _id: req.params.id, owner: req.user })
    .then(handle404)
    .then(book => res.status(200).json({ book: book.toObject() }))
    .catch(next)
})
module.exports = router
