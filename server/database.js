const mongoose = require('mongoose');

// Configure connection
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}, (err) => {
    if (err) throw err;
});

// Define connection
const connection = mongoose.connection;

// Create connection
connection.once('open', () => {
    console.log('DB is connected');
});
