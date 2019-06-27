const express = require('express')
const path = require('path')
const jsonParser = express.json()
const ListService = require('./list-service')
const UsersService = require('../users/users-service')
// const { requireAuth } = require('../middleware/jwt-auth')

const listRouter = express.Router()

listRouter
    .route('/')
    // .all(requireAuth)
    .get((req, res, next) => {
        ListService.getAllListings(req.app.get('db'))
            .then(listings => {
                res.json(listings.map(ListService.serializeListing))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        console.log(req.body.listing)
        const { title, summary, contact, address, type, zip, username } = req.body.listing
        const newListing = { title, summary, contact, address, type, zip, username }

        for (const [key, value] of Object.entries(newListing))
            if (value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        ListService.insertListing(req.app.get('db'), newListing)
            .then(listing => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${listing.id}`))
                    .json(ListService.serializeListing(listing))
            })
            .catch(next)
    })

listRouter
    .route('/:listingId')
    .all(checkListingExists)
    .get((req, res) => {
        res
            .json(ListService.serializeListing(res.listing))
    })

listRouter
    .route('/users/:username')
    .all(checkUserNameExists)
    .get((req, res, next) => {
        ListService.getListingsByUserId(req.app.get('db'), res.userId)
            .then(listings => {
                res.json(listings.map(ListService.serializeListing))
            })
            .catch(next)
    })

listRouter
    .route('/users/:username/:listingId')
    .all(checkUserNameExists)
    .get((req, res, next) => {
        const listingId = parseInt(req.params.listingId)
        ListService.getListingsByUserId(req.app.get('db'), res.userId)
            .then(listings => {
                const listing = listings.filter(listing => listing.id === listingId)
                if (listing.length === 0) {
                    return res
                        .status(404)
                        .json({ error: `Listing doesn't exist` })
                }
                res.json(ListService.serializeListing(listing[0]))
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        console.log(req.body)
        const { title, summary, address, contact, type, zip } = req.body
        const listingId = parseInt(req.params.listingId)
        const newListing = { title, summary, address, contact, type, zip }

        const numberOfValues = Object.values(newListing).filter(Boolean).length
        if (numberOfValues === 0) {
            return res
                .status(400)
                .json({
                    error: `Request body must contain either 'title', 'summary', 'address', 'contact', 'type' or 'zip'.`
                })
        }

        ListService.updateListing(req.app.get('db'), listingId, newListing)
            .then(updatedListing => {
                res
                    .status(201)
                    .json(ListService.serializeListing(updatedListing[0]))
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const listingId = parseInt(req.params.listingId)

        ListService.deleteListing(req.app.get('db'), listingId)
            .then(listings => {
                res
                    .status(201)
                    .json(listings.map(ListService.serializeListing))
            })

    })

async function checkListingExists(req, res, next) {
    try {
        const listing = await ListService.getListingById(
            req.app.get('db'),
            req.params.listingId
        )

        if (!listing)
            return res
                .status(404)
                .json({ error: `Listing doesn't exist` })

        res.listing = listing
        next()
    } catch (error) {
        next(error)
    }
}

async function checkUserNameExists(req, res, next) {
    try {
        const user = await UsersService.getUserIdByUserName(
            req.app.get('db'),
            req.params.username
        )

        if (!user)
            return res
                .status(404)
                .json({ error: `Listing doesn't exist` })

        res.userId = user.id
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = listRouter