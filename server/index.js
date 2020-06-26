// Use config file for environment variables
require('./config/config');

// Import app server
const app = require('./app');

// Connect to database
require('./database');

// Main function
const main = async () => {
    // Listen server in port
    await app.listen(app.get('port'));
    console.log('Server in port', app.get('port'));
}
// Run the function
main();