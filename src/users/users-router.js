const express = require('express')

const usersRouter = express.Router()
const users = require('../../users')
const jsonBodyParser = express.json()

usersRouter
    .route('/')
    .get((req, res) =>
        res
            .status(200)
            .send(users)
    )
    .post(jsonBodyParser, (req, res) => {
        const { id, first_name, last_name, email, username, password } = req.body
        const newUser = { id, first_name, last_name, email, username, password }

        for (const [key, value] of Object.entries(newUser))
            if (value == null)
                return res
                    .status(400)
                    .json({
                        error: { message: `Missing '${key}' in request body` }
                    })

        const matchedUser = users.filter(user => user.username === username)
        const matchedEmail = users.filter(user => user.email === email)

        if (matchedUser.length !== 0) {
            res
                .status(409)
                .json({ error: { message: 'username already taken' } })
        }
        if (matchedEmail.length !== 0) {
            res
                .status(409)
                .json({ error: { message: 'email already taken' } })
        }
        users.push(newUser)
        res
            .status(201)
            .json({ message: 'Registration successful.' })

    })

module.exports = usersRouter