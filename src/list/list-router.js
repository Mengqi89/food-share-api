const express = require('express')

const listRouter = express.Router()
const listings = require('../../listings')

listRouter
    .route('/')
    .get((req, res, next) =>
        res.send(listings).catch(next)
    )

module.exports = listRouter