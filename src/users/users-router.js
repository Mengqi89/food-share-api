const express = require('express')
const path = require('path')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
    .route('/')
    .get((req, res, next) => {
        UsersService.getAllUsers(req.app.get('db'))
            .then(users => {
                res.json(users)
            })
            .catch(next)
    })
    .post(jsonBodyParser, (req, res, next) => {
        const { first_name, last_name, email, username, password } = req.body
        const tempUser = { first_name, last_name, email, username, password }

        for (const [key, value] of Object.entries(tempUser))
            if (value == null)
                return res
                    .status(400)
                    .json({
                        error: { message: `Missing '${key}' in request body` }
                    })

        const passwordError = UsersService.validatePassword(password)
        if (passwordError) {
            return res
                .status(400)
                .json({ error: passwordError })
        }
        UsersService.hasUserWithEmail(req.app.get('db'), username)
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res
                        .status(400)
                        .json({ error: { message: 'email already taken' } })
            })
        UsersService.hasUserWithUserName(req.app.get('db'), username)
            .then(hasUserWithUserName => {
                if (hasUserWithUserName)
                    return res
                        .status(400)
                        .json({
                            error: { message: 'username already taken' }
                        })
                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            first_name,
                            last_name,
                            email,
                            username,
                            password: hashedPassword,
                            date_created: 'now()'
                        }

                        return UsersService.insertUser(req.app.get('db'), newUser)
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user))
                            })
                    })
            })
            .catch(next)
    })

module.exports = usersRouter