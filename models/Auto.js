const mongoose = require('mongoose');

const AutoSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  año: { type: Number, required: true },
  tipo: { type: String, enum: ['compra', 'alquiler'], required: true },
  precio: { type: Number, required: true },
  status: {
    type: String,
    enum: ['disponible', 'alquilado', 'vendido'],
    default: 'disponible',
  },
  detalles: { type: String },
  imagenes: [{ type: String }] // URLs de imágenes
});

const Auto = mongoose.model('Auto', AutoSchema);

module.exports = Auto;
