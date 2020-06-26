const { Router } = require('express');

// Crate de router closure
const router = Router();

// Import requests functions
const { testServer, getUsers, createUser, updateUser, deleteUser, getUser } = require('../controllers/user.controller');

// Use de functions in the routes
router.route('/test')
    .get(testServer);

router.route('/user')
    .get(getUsers)
    .post(createUser);

router.route('/user/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;