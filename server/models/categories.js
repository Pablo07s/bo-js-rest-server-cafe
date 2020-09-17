const mongoose = require('mongoose');
const user = require('./user');


let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido.']
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'Este campo es obligatorio'],
        ref: 'user'
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Category', categorySchema);