const express = require('express')

const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')
require('dotenv').config()


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
app.use( express.static( path.resolve( __dirname, './public' )))
app.use( express.static( path.resolve( __dirname, './storage' )))
//Rutas de usuario
app.use(require('./routes/index'));

//mLab 
mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', true)
mongoose.set('useCreateIndex', true)
mongoose.connect(process.env.URI_DB, (err, res) =>{
    if( err ) throw err;
    console.log("Base de datos ONLINE");
    
});
 
app.listen(process.env.PORT, () =>{
    console.log('Listening in port ', process.env.PORT);
})