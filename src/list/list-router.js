const express = require('express')

const listRouter = express.Router()
const list = require('../../list')

listRouter
    .route('/')
    .get((req, res, next) =>
        res
            .status(200)
            .json(list)
    )

listRouter
    .route('/:listingId')
    .get((req, res, next) => {
        const listingId = parseInt(req.params.listingId)
        const listing = list.filter(listing => listing.id === listingId)
        if (listing.length === 0) {//when I used listing.length === [], it didn't work
            return res
                .status(404)
                .json({ error: { message: `Listing doesn't exist` } })
        }
        res
            .status(200)
            .json(listing[0])
    })

listRouter
    .route('/users/:username')
    .get((req, res, next) => {
        const username = req.params.username
        console.log(username)
        const listing = list.filter(listing => listing.username === username)
        console.log(listing.length)

        if (listing.length === 0) {
            return res
                .status(404)
                .json({ error: { message: `Listing doesn't exist` } })
        }
        res
            .status(200)
            .json(listing)
    })

listRouter
    .route('/users/:username/:listingId')
    .get((req, res, next) => {
        const listingId = parseInt(req.params.listingId)
        const username = req.params.username
        const listing = list.filter(listing =>
            listing.username === username && listing.id === listingId
        )
        if (listing.length === 0) {
            return res
                .status(404)
                .json({ error: { message: `Listing doesn't exist` } })
        }
        res
            .status(200)
            .json(listing[0])
    })

module.exports = listRouter