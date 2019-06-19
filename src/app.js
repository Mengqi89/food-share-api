require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const listRouter = require('./list/list-router')
const usersRouter = require('./users/users-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption))
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
)

app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!')
})

app.use('/api/users', usersRouter)
app.use('/api/list', listRouter)

// /api/list/ -- all listings
// /api/list/:listingId -- a specific listing [GET]
// /api/list/users/:userId  -- all listings of a specific user [GET]
// /api/list/users/:userId/:listingId  -- a listing of a specific user [DELETE/PATCH]

app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { message: error.message, error } // response = { error }
  }
  res.status(500).json(response)
})

module.exports = app