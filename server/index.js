const app = require('./app');

const main = async () => {
    await app.listen(app.get('port'));
    console.log('Server in port', app.get('port'));
}

main();