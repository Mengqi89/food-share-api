//consult blogful-api-solution
const app = require('../src/app')
const { makeListingsArray } = require('./listings.fixture')

describe('GET /api/list', () => {
    // context('given no listing', () => {
    //     it('should responds with 200 and an empty array', () => {
    //         return supertest(app)
    //             .get('/api/list')
    //             .expect(200, [])
    //     })
    // })

    context('given there are listings', () => {
        it('should responds with 200 and an array of listings', () => {
            return supertest(app)
                .get('/api/list')
                .expect(200)
                .expect('Content-Type', /json/)
                .then(res => {
                    expect(res.body).to.be.an('array')
                    expect(res.body).to.have.lengthOf.at.least(1)
                    const listing = res.body[0]
                    expect(listing).to.include.all.keys('id', 'title', 'summary', 'address', 'contact', 'type', 'zip', 'username')
                })
        })
    })
})

describe('GET /api/list/:listingId', () => {
    context('given no listings', () => {
        it('responds with 404', () => {
            const listingId = 9999999
            return supertest(app)
                .get(`/api/list/${listingId}`)
                .expect(404, { error: { message: `Listing doesn't exist` } })
        })
    })

    context('given there are listings', () => {
        const testLisitngs = makeListingsArray()

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
    context('given no listings for a particular username', () => {
        it('responds with 404', () => {
            const username = '$NON-USER$'
            return supertest(app)
                .get(`/api/list/users/${username}`)
                .expect(404, { error: { message: `Listing doesn't exist` } })
        })
    })

    //Do I differentiate having a username but no listings and a nonexistant username

    context('given there are listings for a particular username', () => {
        const testLisitngs = makeListingsArray()

        it('responds with 200 and and an array of listings for that user', () => {
            const username = 'mifflin'
            const expectedListing = testLisitngs.filter(listing => listing.username === username)
            return supertest(app)
                .get(`/api/list/users/${username}`)
                .expect(200, expectedListing)
        })
    })
})

describe('GET /api/list/users/:username/:listingId', () => {
    context('given no listing', () => {
        it('responds with 404', () => {
            const username = 'mifflin'
            const listingId = 999999
            return supertest(app)
                .get(`/api/list/users/${username}/${listingId}`)
                .expect(404, { error: { message: `Listing doesn't exist` } })
        })
    })

    context('given there is a listing for a particular username', () => {
        const testLisitngs = makeListingsArray()

        it('responds with 200 and a specific listing for a specific user', () => {
            const username = 'mifflin'
            const listingId = 3
            const expectedListing = testLisitngs[listingId - 1]
            return supertest(app)
                .get(`/api/list/users/${username}/${listingId}`)
                .expect(200, expectedListing)
        })
    })
})