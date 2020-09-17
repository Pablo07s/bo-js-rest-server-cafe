const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido.']
    },
    price_unit: {
        type: Number,
        required: [true, 'El precio es requerido.']
    },
    category: {
        type: Schema.Types.ObjectId,
        required: [true, 'La categoria es requerido.'],
        ref: 'category'
    },
    stock: {
        type: Boolean,
        required: [true, 'La disponibilidad del producto es requerida']
    },
    user: {
        type: Schema.Types.ObjectId,
        required: [true, 'El usuario debe ser obligatorio'],
        ref: 'user'
    },
    status: {
        type: Boolean,
        required: false,
        default: true
    }
});

module.exports = mongoose.model('Product', productSchema);