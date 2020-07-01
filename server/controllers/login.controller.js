const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const loginController = {};

const User = require('../models/user');

loginController.login = async (req, res) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "(User) or password incorrect"
                }
            });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "User or (password) incorrect"
                }
            });
        }

        const token = jwt.sign({
            user
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        res.json({
            ok: true,
            user,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            error
        });
    }
}

module.exports = loginController;


