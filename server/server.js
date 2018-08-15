require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const {ObjectID} = require('mongodb')

const {mongoose} = require('./db/mongoose')
const {Book} = require('./models/book')
const {User} = require('./models/user')
const {authenticate} = require('./middleware/authenticate')

const app = express()
const port = 3000

const LIST_PROPS = ['_id', 'title', 'author', 'tags', 'shelf']

app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res, next) => {
  res.redirect('http://localhost:8080/')
})

app.post('/books', (req, res) => {
  let book = new Book(req.body.book)

  book.save().then(doc => {
    res.send(doc)
  }, e => {
    console.log(e)
    res.status(400).send(e)
  })
})

app.get('/books', (req, res) => {
  Book.find().then(books => {
    res.send(books.map(book => _.pick(book, LIST_PROPS)))
  }, e => {
    res.status(400).send(e)
  })
})

app.get('/books/:id', (req, res) => {
  const id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Book.findById(id).then(book => {
    if (!book) {
      return res.status(404).send()
    }
    res.send(book)
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
    return res.send(book)
  } catch (e) {
    return res.status(400).send()
  }
})

app.patch('/books/:id', (req, res) => {
  const id = req.params.id
  const newBook = req.body.book

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Book.findByIdAndUpdate(id, {
    $set: newBook
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

app.get('/shelves', authenticate, (req, res) => {
  res.send(req.user.shelves)
})

app.post('/users', async (req, res) => {
  try {
    const user = new User(_.pick(req.body.user, ['username', 'password', 'shelves']))
    await user.save()
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['username', 'password'])
    const user = await User.findByCredentials(body.username, body.password)
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400).send()
  }
})

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token)
    res.status(200).send()
  } catch (e) {
    res.status(400).send()
  }
})

app.listen(port, () => {
  console.log(`Started on port ${port}`)
})

module.exports = {app}
