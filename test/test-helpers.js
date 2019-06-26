const bcrypt = require('bcryptjs')

function makeListingsArray() {
    return [
        {
            'id': 1,
            'title': 'first test title',
            'summary': 'first test summary',
            'address': 'first test address',
            'contact': 'first test contact',
            'type': 'fruit',
            'zip': '84103',
            'username': 1
        },
        {
            'id': 2,
            'title': 'second test title',
            'summary': 'second test summary',
            'address': 'second test address',
            'contact': 'second test contact',
            'type': 'fruit',
            'zip': '84102',
            'username': 2
        },
        {
            'id': 3,
            'title': 'third test title',
            'summary': 'third test summary',
            'address': 'third test address',
            'contact': 'third test contact',
            'type': 'fruit',
            'zip': '84105',
            'username': 3
        }
    ]
}

function makeUsersArray() {
    return [
        {
            'id': 1,
            'username': 'test1',
            'first_name': 'test1',
            'last_name': 'test1',
            'email': 'test1@test.net',
            'password': '!wW101010'
        },
        {
            'id': 2,
            'username': 'test2',
            'first_name': 'test2',
            'last_name': 'test2',
            'email': 'test2@test.net',
            'password': '!wW101010'
        },
        {
            'id': 3,
            'username': 'test3',
            'first_name': 'test3',
            'last_name': 'test3',
            'email': 'test3@test.net',
            'password': '!wW101010'
        }
    ]
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }))
    return db
        .into('users')
        .insert(preppedUsers)
        .then(() =>
            // update the auto sequence to stay in sync
            db.raw(`SELECT setval('users_id_seq', ?)`, [
                users[users.length - 1].id
            ])
        )
}


module.exports = {
    makeListingsArray,
    makeUsersArray,
    seedUsers
}