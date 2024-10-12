const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dni: { type: String, required: true, unique: true },
  telefono: { type: String, required: true },
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

module.exports = Cliente;