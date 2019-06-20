const express = require('express')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const users = require('../../users')

authRouter
    .post('/login', jsonBodyParser, (req, res) => {
        const { username, password } = req.body
        const loginUser = { username, password }

        for (const [key, value] of Object.entries(loginUser))
            if (value == null)
                return res
                    .status(400)
                    .json({
                        error: { message: `Missing '${key}' in request body` }
                    })
        //check if credentials are correct
        const targetCredential = users.filter(user => user.username === username && user.password === password)

        if (targetCredential.length === 0) {
            return res
                .status(400)
                .json({
                    error: { message: 'Incorrect username or password' }
                })
        }

        res
            .status(202)
            .json({ message: 'login successful' })
    })


module.exports = authRouter