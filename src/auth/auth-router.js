const express = require('express')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const AuthService = require('./auth-service')

authRouter
    .post('/login', jsonBodyParser, (req, res, next) => {
        const { username, password } = req.body
        const loginUser = { username, password }

        console.log('login user', loginUser)

        for (const [key, value] of Object.entries(loginUser))
            if (value == null) {
                console.log('value', value)
                return res
                    .status(400)
                    .json({
                        error: { message: `Missing '${key}' in request body` }
                    })
            }
        AuthService.getUserWithUserName(req.app.get('db'), loginUser.username)
            .then(dbUser => {
                console.log('dbUser', dbUser)
                if (!dbUser)
                    return res
                        .status(400)
                        .json({
                            error: { message: 'Incorrect username or password' }
                        })

                return AuthService
                    .comparePasswords(
                        loginUser.password,
                        dbUser.password
                    )
                    .then(compareMatch => {
                        console.log('compareMatch', compareMatch)
                        if (!compareMatch)
                            return res
                                .status(400)
                                .json({
                                    error: { message: 'Incorrect username or password' }
                                })
                        const sub = dbUser.username
                        const payload = { id: dbUser.id }
                        res.json({
                            authToken: AuthService.createJwt(sub, payload)
                        })
                    })
            })
            .catch(next)
    })


module.exports = authRouter