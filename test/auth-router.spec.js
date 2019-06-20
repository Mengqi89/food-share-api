const app = require('../src/app')

describe('POST /api/auth/login', () => {
    it('should return 202 and a message', () => {
        const loginUser = {
            'username': 'dunder',
            'password': 'password'
        }
        return supertest(app)
            .post('/api/auth/login')
            .send(loginUser)
            .expect(202, { message: 'login successful' })
    })
})