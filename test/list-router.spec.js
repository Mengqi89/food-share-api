//consult blogful-api-solution
const knex = require('knex')
const app = require('../src/app')
const { makeListingsArray, makeUsersArray } = require('./test-helpers')

describe('List Endpoints', function () {
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

    describe('GET /api/list', () => {
        context('Given there are no listings', () => {
            it('returns 200 and an empty list', () => {
                return supertest(app)
                    .get('/api/list')
                    .expect(200, [])
            })
        })
        context('Given there are listings', () => {
            const testUsers = makeUsersArray()
            const testLisitngs = makeListingsArray()

            beforeEach('insert listings', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('list')
                            .insert(testLisitngs)
                    })
            })

            it('should responds with 200 and an array of listings', () => {
                return supertest(app)
                    .get('/api/list')
                    .expect(200, testLisitngs)
            })
        })
    })

    describe('GET /api/list/:listingId', () => {
        context('Given no listings', () => {
            it('responds with 404', () => {
                const listingId = 9999999
                return supertest(app)
                    .get(`/api/list/${listingId}`)
                    .expect(404, { error: { message: `Listing doesn't exist` } })
            })
        })

        context('Given there are listings', () => {
            const testUsers = makeUsersArray()
            const testLisitngs = makeListingsArray()

            beforeEach('insert listings', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('list')
                            .insert(testLisitngs)
                    })
            })

            it('responds with 200 and and a specific listing', () => {
                const listingId = 1
                const expectedListing = testLisitngs[listingId - 1]
                return supertest(app)
                    .get(`/api/list/${listingId}`)
                    .expect(200, expectedListing)
            })
        })
    })

    describe('GET /api/list/users/:username', () => {
        context('Given no listings for a particular username', () => {
            it('responds with 404', () => {
                const username = 'nouser'
                return supertest(app)
                    .get(`/api/list/users/${username}`)
                    .expect(404, { error: { message: `Listing doesn't exist` } })
            })
        })

        //Do I differentiate having a username but no listings and a nonexistant username

        context('Given there are listings for a particular username', () => {
            const testUsers = makeUsersArray()
            const testLisitngs = makeListingsArray()

            beforeEach('insert listings', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('list')
                            .insert(testLisitngs)
                    })
            })

            it('responds with 200 and and an array of listings for that user', () => {
                const username = 'test1'
                const userId = 1
                const expectedListing = testLisitngs.filter(listing => listing.username === userId)
                return supertest(app)
                    .get(`/api/list/users/${username}`)
                    .expect(200, expectedListing)
            })
        })
    })
    describe('GET /api/list/users/:username/:listingId', () => {
        context('Given no listing', () => {
            it('responds with 404', () => {
                const username = 'noname'
                const listingId = 999999
                return supertest(app)
                    .get(`/api/list/users/${username}/${listingId}`)
                    .expect(404, { error: { message: `Listing doesn't exist` } })
            })
        })

        context('Given there is a listing for a particular username', () => {
            const testUsers = makeUsersArray()
            const testLisitngs = makeListingsArray()

            beforeEach('insert listings', () => {
                return db
                    .into('users')
                    .insert(testUsers)
                    .then(() => {
                        return db
                            .into('list')
                            .insert(testLisitngs)
                    })
            })

            it('responds with 200 and a specific listing for a specific user', () => {
                const username = 'test1'
                const listingId = 1
                const expectedListing = testLisitngs[listingId - 1]
                return supertest(app)
                    .get(`/api/list/users/${username}/${listingId}`)
                    .expect(200, expectedListing)
            })
        })
    })
    describe('PATCH /api/list/users/:username/:listingId', () => {
        const testUsers = makeUsersArray()
        const testLisitngs = makeListingsArray()

        beforeEach('insert listings', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('list')
                        .insert(testLisitngs)
                })
        })

        it('responds with 200 and the updated listing', () => {
            const idToUpdate = 1
            const userToUpdate = 'test1'
            const updateListing = {
                'id': 1,
                'title': 'updated first test title',
                'summary': 'updated first test summary',
                'address': 'first test address',
                'contact': 'first test contact',
                'type': 'fruit',
                'zip': '84103',
                'username': 1
            }
            const index = testLisitngs.findIndex(listing => listing.id === idToUpdate)
            const expectedListing = {
                ...testLisitngs[index],
                ...updateListing
            }
            return supertest(app)
                .patch(`/api/list/users/${userToUpdate}/${idToUpdate}`)
                .send(updateListing)
                .expect(201, expectedListing)
        })

    })
    describe('DELETE /api/list/users/:username/:listingId', () => {
        const testUsers = makeUsersArray()
        const testLisitngs = makeListingsArray()

        beforeEach('insert listings', () => {
            return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                        .into('list')
                        .insert(testLisitngs)
                })
        })

        it('responds with 200 and the updated list', (() => {
            const idToDelete = 1
            const targetUser = 'test1'

            const index = testLisitngs.findIndex(listing => listing.id === idToDelete)
            testLisitngs.splice(index, 1)
            const expectedListing = testLisitngs

            return supertest(app)
                .delete(`/api/list/users/${targetUser}/${idToDelete}`)
                .expect(201, expectedListing)
        }))
    })
})