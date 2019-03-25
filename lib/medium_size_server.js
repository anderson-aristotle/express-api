const express = require('express')
const bodyParser = require('body-parser')

// for this example, we'll use an in-memory array in place of a database
const books = [
  { title: 'Dictionary', author: 'Webster' },
  { title: 'Encyclopedia', author: 'Encarta' },
  { title: 'Clean Code', author: 'Robert Cecil Martin' }
]

// your code goes here!
const app = express()
app.use(bodyParser.json())

app.use((req, res, next) => {
  const timeNow = new Date().toTimeString().slice(0, 17)
  console.log(`${timeNow}: got a ${req.method} to ${req.path}`)
  next()
})

app.get('/books', (req, res) => {
  const booksWithId = books.map((book, index) => ({
    title: book.title,
    author: book.author,
    id: index
  }))
  res.json({ books: booksWithId })
})

app.get('/books/:id', (req, res) => {
  const bookId = req.params.id
  const book = books[bookId]
  res.json({ book })
})

app.post('/books', (req, res) => {
  console.log(req.body)
  const newBook = req.bodt
  books.push(newBook)
  res.status(201).json(newBook)
})

app.listen(4741, () => console.log('Lib API running on port localhost:4741'))
