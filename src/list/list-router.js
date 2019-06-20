const express = require('express')
const listRouter = express.Router()
const list = require('../../list')
const jsonParser = express.json()


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
        const listing = list.filter(listing => listing.username === username)
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
    .patch(jsonParser, (req, res, next) => {
        const { id, title, summary, address, contact, type, zip, username } = req.body
        const listingId = parseInt(req.params.listingId)
        const listingToUpdate = { id, title, summary, address, contact, type, zip, username }

        const numberOfValues = Object.values(listingToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res
                .status(400)
                .json({
                    error: {
                        message: `Request body must contain either 'title', 'summary', 'address', 'contact', 'type' or 'zip'.`
                    }
                })
        }
        list.splice([listingId - 1], 1, listingToUpdate)
        res
            .status(200)
            .json(list[listingId - 1])
    })
    .delete((req, res, next) => {
        const listingId = parseInt(req.params.listingId)
        list.splice([listingId - 1], 1)
        res
            .status(200)
            .json(list)
    })


module.exports = listRouter