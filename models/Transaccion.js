const mongoose = require('mongoose');

const TransaccionSchema = new mongoose.Schema({
  cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true }, // Referencia al cliente
  auto: { type: mongoose.Schema.Types.ObjectId, ref: 'Auto', required: true }, // Referencia al auto
  tipo: { type: String, enum: ['compra', 'alquiler'], required: true }, // Tipo de transacción
  fecha: { type: Date, default: Date.now }, // Fecha de la transacción
  estado: { type: String, enum: ['completada', 'pendiente', 'cancelada'], default: 'pendiente' }, // Estado de la transacción
});

const Transaccion = mongoose.model('Transaccion', TransaccionSchema);

module.exports = Transaccion;