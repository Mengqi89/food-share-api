const app = require('../src/app')

describe('GET /api/users', () => {
    it('should return an array of users', () => {
        return supertest(app)
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1)
                const user = res.body[0]
                expect(user).to.include.all.keys('id', 'userId', 'password')
            })
    })
})