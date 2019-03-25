// requiring NPM (node modules) packages
const express = require('express')
const passport = require('passport')

// require the relevant model
// model will give us the method we need to interact with the server
const Example = require('../models/example')

// error handling helper functions
const customErrors = require('../../lib/custom_errors')

// this function will be passed to `.then` after a DB query and will return a
// 404 status code if nothing was found
const handle404 = customErrors.handle404
// a function that we pass `req` and a resource from the DB to, and find out
// if the current user owns that resource
const requireOwnership = customErrors.requireOwnership

// this is a helper function for `update` which prevents overwriting data
// with empty string
const removeBlanks = require('../../lib/remove_blank_fields')

// this is middleware that aborts the route handler and sends back a 401
// staus code if the request didnt have a valid token, otherwise it sets req.user
const requireToken = passport.authenticate('bearer', { session: false })

// creates a router object that we attach routes to, then export over to
// server.js, where we attach all those routes onto our main `app` object
const router = express.Router()

// INDEX
// GET /examples
// attach a route for `GET` requests to `/examples`, pass `requireToken`
// special attention to TOKEN
// `next` is an error handler store
router.get('/examples', requireToken, (req, res, next) => {
// use mongoose example Model to search for ALL examples
  Example.find({ owner: req.user._id })
  // iterate over whatever we got from `.find` and convert to POJOs
    .then(examples => {
      // set status to 200, send back JSON with key `examples` whose value is
      // the array of examples POJOs
      return examples.map(example => example.toObject())
    })
    .then(examples => res.status(200).json({ examples: examples }))
    // if anything in this promise chain triggered an error, pass it off to
    // error handling middleware
    .catch(next)
})

// SHOW
// GET /examples/5a7db6c74d55bc51bdf39793
router.get('/examples/:id', requireToken, (req, res, next) => {
  // req.params is an object containing a key for each dynamic segment in the
  // URL, e.g. `:id`
  Example.findById(req.params.id)
  // pass of the results of that query to `handle404` whixh will send back 404
  // if we didn't find anything
    .then(handle404)
    // send the found document back to the user, in an object with key example
    .then(example => res.status(200).json({ example: example.toObject() }))
    .catch(next)
})

// CREATE
// POST /examples
router.post('/examples', requireToken, (req, res, next) => {
  req.body.example.owner = req.user.id

  Example.create(req.body.example)
    .then(example => {
      res.status(201).json({ example: example.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /examples/5a7db6c74d55bc51bdf39793
router.patch('/examples/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.example.owner

  Example.findById(req.params.id)
    .then(handle404)
    .then(example => {
      requireOwnership(req, example)

      return example.update(req.body.example)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/examples/:id', requireToken, (req, res, next) => {
  Example.findById(req.params.id)
    .then(handle404)
    .then(example => {
      requireOwnership(req, example)
      example.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
