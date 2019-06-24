const xss = require('xss')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    getAllUsers(db) {
        return db
            .from('users')
            .select(
                'users.id',
                'users.username',
                'users.first_name',
                'users.last_name',
                'users.email',
                'users.password'
            )
    },
    getUserIdByUserName(db, username) {
        return db
            .from('users')
            .where('users.username', username)
            .first()

    },
    hasUserWithUserName(db, username) {
        return db('users')
            .where({ username })
            .first()
            .then(user => !!user)
    },
    hasUserWithEmail(db, email) {
        return db('users')
            .where({ email })
            .first()
            .then(email => !!email)
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('users')
            .returning('*')
            .then(([user]) => user)
    },
    validatePassword(password) {
        if (password.length < 8) {
            return 'Password be longer than 8 characters'
        }
        if (password.length > 72) {
            return 'Password be less than 72 characters'
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces'
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case, lower case, number and special character'
        }
        return null
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
            username: xss(user.username),
            email: xss(user.email),
            password: xss(user.password)
        }
    }
}

module.exports = UsersService
