const request = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const User = require('../models/user');

const { setupDB } = require('./test-setup');

setupDB('test');

test('Server works test', async done => {
    const res = await request(app)
        .get('/api/v1/test');

    // Match that response is equal to the object
    expect(res.body).toEqual({ message: 'All works!' });
    // Check status code
    expect(res.status).toBe(200);

    done();
});

test('GET users', async done => {
    const res = await request(app)
        .get('/api/v1/user');

    expect(res.status).toBe(200);
    expect(res.body.users.length).toBeGreaterThanOrEqual(0);

    done();
});

test('POST new user', async done => {
    const res = await request(app)
        .post('/api/v1/user')
        .send({
            name: "a",
            username: "a",
            password: "123456",
            email: "a@a.com"
        });

    const user = await User.findOne({ email: "a@a.com" })

    expect(res.status).toBe(200);
    expect(user.email).toBeTruthy();
    expect(user.name).toBeTruthy();

    done();
});

test('Invalid user role', async done => {
    const res = await request(app)
        .post('/api/v1/user')
        .send({
            name: "a",
            username: "a",
            password: "123456",
            email: "a@a.com",
            role: "ANOTHER_ROLE"
        });

    expect(res.status).toBe(400);
    expect(res.body.error.message.includes("ANOTHER_ROLE is not a valid role")).toBeTruthy();
    expect(res.body.ok).toBeFalsy();

    done();
});

test('No data create user', async done => {
    const res = await request(app)
        .post('/api/v1/user');

    expect(res.status).toBe(400);
    expect(res.body.error.message.includes("Name Required, username: Username Required, password: Password Required, email: Email Required")).toBeTruthy();
    expect(res.body.ok).toBeFalsy();

    done();
});

test('PUT Update a user success', async done => {
    const user = new User({
        name: "test",
        username: "test",
        password: "123456",
        email: "test@mail.com"
    });

    const userCreated = await user.save();

    const res = await request(app)
        .put(`/api/v1/user/${userCreated._id}`)
        .send({
            name: "testUpdated"
        });

    const userUpdated = await User.findById(userCreated._id);

    expect(res.status).toBe(200);
    expect(userUpdated.name).toBe("testUpdated");
    expect(userUpdated._id).toStrictEqual(userCreated._id);

    done();
});

test('PUT Update a user wrong id', async done => {
    const user = new User({
        name: "test",
        username: "test",
        password: "123456",
        email: "test@mail.com"
    });

    const userCreated = await user.save();

    const res = await request(app)
        .put(`/api/v1/user/${userCreated._id}5`)
        .send({
            name: "testUpdated"
        });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBeFalsy();

    done();
});

test('PUT don\'t update passsword', async done => {

    const res1 = await request(app)
        .post('/api/v1/user')
        .send({
            name: "test",
            username: "test",
            password: "123456",
            email: "test@mail.com"
        });

    const res2 = await request(app)
        .put(`/api/v1/user/${res1.body.userCreated._id}`)
        .send({
            password: "123456789"
        });

    const userDB = await User.findById(res1.body.userCreated._id);

    expect(await bcrypt.compare("123456789", userDB.password)).toBeFalsy();
    expect(await bcrypt.compare("123456", userDB.password)).toBeTruthy();

    done();
});

test('DELETE user success', async done => {

    const user = new User({
        name: "test",
        username: "test",
        password: "123456",
        email: "test@mail.com"
    });

    const userCreated = await user.save();

    const res = await request(app)
        .delete(`/api/v1/user/${userCreated._id}`);

    expect(res.status).toBe(200);
    expect(res.body.userDeleted.state).toBe("false");

    done();
});

test('DELETE user wrong id', async done => {

    const user = new User({
        name: "test",
        username: "test",
        password: "123456",
        email: "test@mail.com"
    });

    const userCreated = await user.save();

    const res = await request(app)
        .delete(`/api/v1/user/${userCreated._id}0`);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBeFalsy();

    done();
});

test('GET one user success', async done => {
    const user = new User({
        name: "test",
        username: "test",
        password: "123456",
        email: "test@mail.com"
    });

    const userDB = await user.save();

    const res = await request(app)
        .get(`/api/v1/user/${userDB._id}`);

    expect(res.status).toBe(200);
    expect(userDB._id.toString()).toEqual(res.body.user._id);

    done();
});

test('GET one user wrong id', async done => {
    const user = new User({
        name: "test",
        username: "test",
        password: "123456",
        email: "test@mail.com"
    });

    const userDB = await user.save();

    const res = await request(app)
        .get(`/api/v1/user/${userDB._id}5`);

    expect(res.status).toBe(400);
    expect(res.body.ok).toBeFalsy();

    done();
});