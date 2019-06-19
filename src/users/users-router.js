const express = require('express')

const usersRouter = express.Router()
const users = require('../../users')

usersRouter
    .route('/')
    .get((req, res, next) =>
        res
            .status(200)
            .send(users)
    )

module.exports = usersRouter