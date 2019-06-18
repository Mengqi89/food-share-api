require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV, CLIENT_ORIGIN } = require('./config')
const listRouter = require('./list/list-router')

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

// const listings = require('../listings')
const myList = require('../myList')

app.use(helmet())

// app.get('/list', (req, res) => {
//   res.send(listings)
// })

app.use('/api/list', listRouter)

app.get('/mylist', (req, res) => {
  res.send(myList)
})

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