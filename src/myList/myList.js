const express = require('express')

const myListRouter = express.Router()
const myList = require('../../myList')

myListRouter
    .route('/')
    .get((req, res, next) =>
        res.send(myList).catch(next)
    )

module.exports = myListRouter