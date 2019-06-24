require('dotenv').config() //why do you need this? I don't see access to .env file.
const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest