const express = require('express');
const app = express();

// Settings
app.set('port', process.env.PORT);

// Middlewares
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Routes
app.use('/api/v1', require('./routes/user'));

module.exports = app;
