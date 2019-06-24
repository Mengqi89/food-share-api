const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const { makeUsersArray } = require('./test-helpers')

describe('Users Endpoints', function () {
    let db

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

    describe('GET /api/users', () => {
        context('Given there are no users', () => {
            it('returns 200 and an empty array', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, [])
            })
        })
        context('Given there are users', () => {
            const testUsers = makeUsersArray()
            beforeEach('insert users', () => {
                return db
                    .into('users')
                    .insert(testUsers)
            })
            it('responds with 200 and all the users', () => {
                return supertest(app)
                    .get('/api/users')
                    .expect(200, testUsers)
            })
        })
    })

    describe('POST /api/users', () => {
        context('Happy path', () => {
            it('responds 201, serialized user, storing bcryped password', () => {
                const newUser = {
                    "first_name": "newUser",
                    "last_name": "newUser",
                    "username": "newUser",
                    "password": "!wW898989",
                    "email": "newuser@newuser.net"
                }
                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.username).to.eql(newUser.username)
                        expect(res.body.first_name).to.eql(newUser.first_name)
                        expect(res.body.last_name).to.eql(newUser.last_name)
                        expect(res.body).to.have.property('password')
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
                    })
                    .expect(res =>
                        db
                            .from('users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.username).to.eql(newUser.username)
                                expect(row.first_name).to.eql(newUser.first_name)
                                return bcrypt.compare(newUser.password, row.password)
                                    .then(compareMatch => {
                                        expect(compareMatch).to.be.true
                                    })
                            })
                    )
            })
        })
    })
})