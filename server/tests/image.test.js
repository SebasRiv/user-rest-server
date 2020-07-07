const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const User = require('../models/user');

require('../config/config');

const { setupDB } = require('./test-setup');

setupDB('test');

test('upload user avatar success', async done => {
    const user1 = new User({
        name: "test1",
        username: "test1",
        password: await bcrypt.hash("123456", 10),
        email: "test1@mail.com",
        role: "ADMIN_ROLE"
    });

    const user2 = new User({
        name: "test2",
        username: "test2",
        password: await bcrypt.hash("123456", 10),
        email: "test2@mail.com",
        role: "ADMIN_ROLE"
    });

    const userDB1 = await user1.save();
    const userDB2 = await user2.save();

    const login = await request(app)
        .post('/api/v1/login')
        .send({
            email: userDB1.email,
            password: "123456"
        });

    const res = await request(app)
        .put(`/api/v1/upload/users/${userDB2._id}`)
        .set('token', login.body.token)
        .attach('file', 'server/assets/test.jpg');

    console.log(res.body);

    expect(res.status).toBe(200);

    done();
});

test('upload user avatar failed', async done => {
    const user1 = new User({
        name: "test1",
        username: "test1",
        password: await bcrypt.hash("123456", 10),
        email: "test1@mail.com",
        role: "ADMIN_ROLE"
    });

    const user2 = new User({
        name: "test2",
        username: "test2",
        password: await bcrypt.hash("123456", 10),
        email: "test2@mail.com",
        role: "ADMIN_ROLE"
    });

    const userDB1 = await user1.save();
    const userDB2 = await user2.save();

    const login = await request(app)
        .post('/api/v1/login')
        .send({
            email: userDB1.email,
            password: "123456"
        });

    const res = await request(app)
        .put(`/api/v1/upload/users/${userDB2._id}5`)
        .set('token', login.body.token)
        .attach('file', 'server/assets/test.jpg');

    console.log(res.body);

    expect(res.status).toBe(400);

    done();
});