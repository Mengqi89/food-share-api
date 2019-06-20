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
                expect(user).to.include.all.keys('id', 'username', 'password')
            })
    })
    it('should responds with 201 and a message', () => {
        newUser = {
            id: 4,
            first_name: 'clark',
            last_name: 'nelson',
            email: 'clark@gmail.com',
            username: 'clark',
            password: 'password'
        }
        return supertest(app)
            .post('/api/users')
            .send(newUser)
            .expect(201, { message: 'Registration successful.' })
    })
})