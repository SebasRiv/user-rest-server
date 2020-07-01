const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const User = require('../models/user');

const { setupDB } = require('./test-setup');

require('../config/config');

setupDB('test');

test('Login user success', async done => {

    const user = new User({
        name: "test",
        username: "test",
        password: await bcrypt.hash("123456", 10),
        email: "test@mail.com"
    });

    const userCreated = await user.save();

    const login = await request(app)
        .post('/api/v1/login')
        .send({
            email: userCreated.email,
            password: "123456"
        });

    expect(login.status).toBe(200);
    expect(login.body.ok).toBeTruthy();

    done();
});

test('Login wrong user', async done => {

    const user = new User({
        name: "test",
        username: "test",
        password: await bcrypt.hash("123456", 10),
        email: "test@mail.com"
    });

    const userCreated = await user.save();

    const login = await request(app)
        .post('/api/v1/login')
        .send({
            email: "wrongemail@mail.com",
            password: "123456"
        });

    expect(login.status).toBe(400);
    expect(login.body.ok).toBeFalsy();
    expect(login.body.error.message).toBe("(User) or password incorrect");

    done();
});

test('Login wrong password', async done => {

    const user = new User({
        name: "test",
        username: "test",
        password: await bcrypt.hash("123456", 10),
        email: "test@mail.com"
    });

    const userCreated = await user.save();

    const login = await request(app)
        .post('/api/v1/login')
        .send({
            email: "test@mail.com",
            password: "1234567"
        });

    expect(login.status).toBe(400);
    expect(login.body.ok).toBeFalsy();
    expect(login.body.error.message).toBe("User or (password) incorrect");

    done();
});