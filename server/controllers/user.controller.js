const bcrypt = require('bcrypt');
const _ = require('underscore');

//Object that contain the request methods
const userController = {};

//Import UserSchema for requests
const User = require('../models/user');

//Resquest test
userController.testServer = (req, res) => {
    res.json({
        message: 'All works!'
    });
}

// GET all user paginated
userController.getUsers = async (req, res) => {

    const from = Number(req.query.from) || 0;
    const to = Number(req.query.to) || 10;

    try {
        const users = await User.find({ state: true })
            .skip(from)
            .limit(to)
            .exec();

        const count = await User.find()
            .countDocuments()
            .exec()

        res.status(200).json({
            ok: true,
            users,
            count
        });
    } catch (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }
}

// GET one user
userController.getUser = async (req, res) => {

    const { id } = req.params;

    try {
        const user = await User.findById(id);

        res.status(200).json({
            ok: true,
            user
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            error
        });
    }
}

// POST new user
userController.createUser = async (req, res) => {

    const { name, username, password, email, role } = req.body;

    try {
        const user = new User({
            name,
            username,
            password: password ? await bcrypt.hash(password, 10) : undefined,
            email,
            role
        });

        const userCreated = await user.save();
        res.json({
            ok: true,
            userCreated
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            error
        });
    }
}

// PUT user (update)
userController.updateUser = async (req, res) => {

    const { id } = req.params;
    const body = _.pick(req.body, ['name', 'username', 'email', 'avatar', 'role', 'state']);

    try {
        const userUpdated = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        res.status(200).json({
            ok: true,
            userUpdated
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            error
        });
    }
}

// DELETE a user (disabled)
userController.deleteUser = async (req, res) => {

    const { id } = req.params;

    try {
        const userDeleted = await User.findByIdAndUpdate(id, { state: false }, { new: true });

        res.status(200).json({
            ok: true,
            userDeleted
        });
    } catch (error) {
        return res.status(400).json({
            ok: false,
            error
        });
    }
}

module.exports = userController;