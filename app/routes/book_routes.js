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
router.get('/books', requireToken, (req, res, next) => {
  Book.find({ owner: req.user._id })
    .then(books => books.map(book => book.toObject()))
    .then(books => res.status(200).json({ books }))
    .catch(next)
})
module.exports = router
