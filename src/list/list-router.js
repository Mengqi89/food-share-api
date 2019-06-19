const express = require('express')

const listRouter = express.Router()
const list = require('../../list')

listRouter
    .route('/')
    .get((req, res, next) =>
        res
            .status(200)
            .send(list)
    )

listRouter
    .route('/:listingId')
    .get((req, res, next) => {
        const listingId = parseInt(req.params.listingId)
        const listing = list.filter(listing => listing.id === listingId)
        res
            .status(200)
            .send(listing)
    })

listRouter
    .route('/users/:userId')
    .get((req, res, next) => {
        const userId = req.params.userId
        console.log(req.params)
        console.log(req.params.userId)
        const listing = list.filter(listing => listing.userId === userId)
        res
            .status(200)
            .send(listing)
    })

listRouter
    .route('/users/:userId/:listingId')
    .get((req, res, next) => {
        const listingId = parseInt(req.params.listingId)
        const userId = req.params.userId
        console.log(listingId, userId)
        const listing = list.filter(listing =>
            listing.userId === userId && listing.id === listingId
        )
        res
            .status(200)
            .send(listing)
    })

module.exports = listRouter