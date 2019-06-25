const app = require('../src/app')
const jwt = require('jsonwebtoken')
const knex = require('knex')
const { makeUsersArray, seedUsers } = require('./test-helpers')


describe.skip('POST /api/auth/login', () => {
    let db

    const testUsers = makeUsersArray()
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE users, list RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE users, list RESTART IDENTITY CASCADE'))

    it('should return 202 and a JWT auth token', () => {

        beforeEach('insert users', () => seedUsers(db, testUsers))

        const userValidCreds = {
            username: testUser.username,
            password: testUser.password
        }

        const expectedToken = jwt.sign(
            { id: testUser.id },
            process.env.JWT_SECRET,
            {
                subject: testUser.username,
                expiresIn: process.env.JWT_EXPIRY,
                algorithm: 'HS256'
            }
        )

        return supertest(app)
            .post('/api/auth/login')
            .send(userValidCreds)
            .expect(202, {
                authToken: expectedToken
            })
    })
})