//Object that contain the request methods
const userController = {};

//Import UserSchema for requests
const User = require('../models/user');

//Resquest test
userController.getUsers = (req, res) => {
    res.json('All works!');
}

module.exports = userController;