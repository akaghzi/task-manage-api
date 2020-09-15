const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const supertest = require('supertest')
const User = require("../src/models/user");

const oid = new mongoose.Types.ObjectId()
const token = jwt.sign({_id: oid}, process.env.JWT_KEY)
const user1 = new User({
    _id: oid,
    name: 'John Smith',
    password: 'johnsmith123',
    email: 'akaghzi+jsmith@gmail.com',
    city: 'Edmonton',
    age: 34,
    tokens: {
        token: token
    }
})

beforeAll(async () => {
    await User.deleteMany()
    await new User(user1).save()
});
// afterAll(() => console.log('1 - afterAll'));
// beforeEach(() => console.log('1 - beforeEach'));
// afterEach(() => console.log('1 - afterEach'));

test('keepAlive', async () => {
    await supertest(app).get('').send({}).expect(200)
})

test('create user', async () => {
    const response = await supertest(app).post('/users').send({
        name: 'Mahad Kaghzi',
        password: 'hussain7',
        email: 'mahadkaghzi@gmail.com',
        city: 'Sukkur',
        age: 5
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    // console.log(user)

    expect(response.body).toMatchObject({
        user: {
            name: 'Mahad Kaghzi',
            age: 5
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('hussain7')


})

test('check existing user ', async () => {
    const user = await User.findById(user1._id)
    expect(user).not.toBeNull()
})

test('login user', async () => {
    const response = await supertest(app).post('/users/login').send({
        password: user1.password,
        email: user1.email,
    }).expect(200)

    const user = await User.findById(response.body.user._id)

    expect(user.tokens[1].token).toBe(response.body.token)

})

test('create user should fail', async () => {
    await supertest(app).post('/users').send({
        name: 'Mahad Kaghzi',
        password: 'hussain7',
        email: 'mahadkaghzi@gmail.com',
        city: 'Sukkur',
        age: 5
    }).expect(400)
})

test('login user should fail', async () => {
    await supertest(app).post('/users/login').send({
        password: user1.city,
        email: user1.email,
    }).expect(400)
})

test('show me', async () => {
    await supertest(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({})
        .expect(200)
})

test('show me should fail for unauthorized', async () => {
    await supertest(app)
        .get('/users/me')
        .send({})
        .expect(401)
})

test('upload avatar', async () => {
    await supertest(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .attach('avatar', './tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(user1._id)

    expect(user.avatar).toEqual(expect.any(Buffer))

})

test('update fields', async () => {
    await supertest(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            age: 54
        })
        .expect(200)

    await supertest(app)
        .patch('/users/me')
        .send({
            age: 54
        })
        .expect(401)

    const user = await User.findById(user1._id)

    expect(user.age).toBe(54)

    await supertest(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({
            profession: 'Writer'
        })
        .expect(400)


})

test('delete me', async () => {
    await supertest(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${user1.tokens[0].token}`)
        .send({})
        .expect(200)

    const user = await User.findById(user1._id)

    expect(user).toBeNull()

})

test('delete me should fail for unauthorized', async () => {
    await supertest(app)
        .delete('/users/me')
        .send({})
        .expect(401)
})

