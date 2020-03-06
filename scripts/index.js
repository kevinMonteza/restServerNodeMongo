const mongoose = require('mongoose')
const Usuario = require('../models/usuario')

mongoose.connect('mongodb://localhost:27017/cafe', (err, res) =>{
    if( err ) throw err;

    console.log("Base de datos ONLINE");
    
});
const db = mongoose.connection

db.once('open', run)

async function run(){
    await createUser()
    console.log("usuario creado")
}

async function createUser(){
    await Usuario.create([
        {
           nombre:"kevin",
           email:"test@test.com",
           password:"test",
           img:'imgane.png',
           role:"ADMIN_ROLE"
        }
    ])
}