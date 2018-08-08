const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Book} = require('./models/book')


const app = express()
const port = 3000

app.use(bodyParser.json())

app.post('/books', (req, res) => {
  let book = new Book({
    title: req.body.title,
    author: req.body.author
  })

  book.save().then(doc => {
    res.send(doc)
  }, e => {
    res.status(400).send(e)
  })
})

app.get('/books', (req, res) => {
  Book.find().then(books => {
    res.send(books)
  }, e => {
    res.status(400).send(e)
  })
})

// using async/await syntax on this one for variety
// TODO: decide which to go with fully
app.delete('/books/:id', async (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  try {
    const book = await Book.findByIdAndDelete(id)
    if (!book) {
      return res.status(404).send()
    }
    res.send(book)
  } catch (e) {
    res.status(400).send()
  }

  res.send()
})

app.patch('/books/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Book.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then(book => {
    if (!book) {
      return res.status(404).send()
    }
    res.send({book})
  }).catch(e => {
    res.status(400).send()
  })
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app}
