const mongoose = require('mongoose');

// Remove collections data
const removeAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
}

// Remove collections
const dropAllCollections = async () => {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            if(error.message === 'ns not found') return;
            if(error.message.includes('a background operation is currenlty running')) return;
            console.log(error.message);
        } 
    }
}

module.exports = {
    setupDB (databaseName) {

        // Connecto to Mongoose
        beforeAll(async () => {
            const url = `mongodb://localhost:27017/${databaseName}`;
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false
            });
        });

        // Cleans up database between each test
        afterEach(async () => {
            await removeAllCollections()
        });
        
        // Disconnect Moongose
        afterAll(async () => {
            await dropAllCollections();
            await mongoose.connection.close();
        });
    }
}