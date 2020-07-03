const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// Settings
app.set('port', process.env.PORT);

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }))

// Routes
app.use('/api/v1', require('./routes/login'));
app.use('/api/v1', require('./routes/user'));
app.use('/api/v1', require('./routes/image'));

module.exports = app;
