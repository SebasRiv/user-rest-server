
//=================
// Port
//=================
process.env.PORT = process.env.PORT || 4000;

//=================
// Enviroment
//=================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'; 

//=================
// Token expiration
//=================
//60 seconds
//60 minutes
//24 hours
//30 days

process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

//=================
//authentication seed
//=================
process.env.SEED = process.env.SEED || 'development-seed';

//=================
// Data Base
//=================

let urlDB;

 if (process.env.NODE_ENV == 'dev') {
     urlDB = 'mongodb://localhost:27017/users';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;