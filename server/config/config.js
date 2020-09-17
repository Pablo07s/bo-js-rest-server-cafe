/**********************
 *  EL puerto global
 **********************/

process.env.PORT = process.env.PORT || 3000;

/**********************
 * Duracion del token
 ***********************/
// segundos-minutos-horas-dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

 /**********************
 * SEED
 ***********************/
process.env.SEED =  process.env.SEED || 'september-charglie@-12345'

 /**********************
 * ENVIRONMENT
 ***********************/
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**********************
 * DB_URI
 ***********************/
let urlDB;

if (process.env.NODE_ENV === 'development') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;