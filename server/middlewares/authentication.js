const jwt = require('jsonwebtoken');

// Token verification

const tokenVerification = (req, res, next) => {

    const token = req.get('token');

    try {
        const decoded = jwt.verify(token, process.env.SEED);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            error
        });
    }
}

// Admin role verification

const adminRoleVerification = (req, res, next) => {
    const user = req.user;

    if (user.role != "ADMIN_ROLE") {
        return res.status(401).json({
            ok: false,
            error: {
                message: 'The user isn\'t admin'
            }
        });
    }

    next();
}

module.exports = {
    tokenVerification,
    adminRoleVerification
}