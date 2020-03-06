
const mongoose = require('mongoose');

/**
 * mongoose-unique-validator
 * para personalizar los mensajes de validacion de claves unicas
 */
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol vàlido'
}

let usuarioSchema = new Schema ({
    nombre:{
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email:{
        type: String,
        unique: true,
        required: [true,'El correo es requerido']
    },
    password:{
        type: String,
        required: [true,"Contrase;a es requerida"]
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default:'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        default:true
    },
    google:{
        type: Boolean,
        default:false
    }
});


/**
 * metodo para no retornar el password en el json
 */
usuarioSchema.methods.toJSON = function(){
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}


usuarioSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

module.exports = mongoose.model('Usuario', usuarioSchema);