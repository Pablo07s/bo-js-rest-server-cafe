const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un role valido !'
} 

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida.']
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    img: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// ocultar el password y encriptarlo
userSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

userSchema.plugin( uniqueValidator, { message: 'El {PATH} no esta disponible'});
module.exports = mongoose.model('User', userSchema);