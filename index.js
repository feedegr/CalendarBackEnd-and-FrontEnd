const express = require ('express');
require ('dotenv').config();
const { dbConnection } = require ('./database/config');
const cors = require ('cors');


//creacion de server

const app = express();

// Base de datos
dbConnection();

//cors

app.use(cors());

//directorio publico

app.use( express.static('public') );


//Lectura y parse de body

app.use( express.json() );


//ruta
app.use('/api/auth',require('./routes/auth'));
app.use('/api/events',require('./routes/events'));


// escuchar peticion 

app.listen (process.env.PORT, () => {
    console.log(`server on port ${process.env.PORT}`);
});