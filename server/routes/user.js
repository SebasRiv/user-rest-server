const { Router } = require('express');

const { tokenVerification, adminRoleVerification } = require('../middlewares/authentication');

// Crate de router closure
const router = Router();

// Import requests functions
const { testServer, getUsers, createUser, updateUser, deleteUser, getUser } = require('../controllers/user.controller');

// Use de functions in the routes
router.route('/test')
    .get(testServer);

router.route('/user')
    .get([tokenVerification, adminRoleVerification], getUsers)
    .post(createUser);

router.route('/user/:id')
    .all(tokenVerification)
    .get(getUser)
    .put(adminRoleVerification, updateUser)
    .delete(adminRoleVerification, deleteUser);

module.exports = router;