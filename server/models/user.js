const { Schema, model } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Allowed server roles
const validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol definido'
}

// User database model in mongodb
const UserSchema = new Schema({
    // Name of the person
    name: {
        type: String,
        required: [true, 'Name Required'],
    },

    // Username name in server
    username: {
        type: String,
        required: [true, 'Username Required']
    },

    // Password in server
    password: {
        type: String,
        required: [true, 'Password Required']
    },

    // User email
    email: {
        type: String,
        required: [true, 'Email Required']
    },

    // User avatar (optional)
    avatar: {
        type: String,
        required: false
    },

    // User role in server (USER_ROLE by default)
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },

    // It will not be removed from the system, only disabled
    state: {
        type: String,
        default: true
    }
});

//Eliminate password from request
UserSchema.methods.toJSON = function () {

    const user = this;
    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// User unique-validator plugin
UserSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = model('User', UserSchema);