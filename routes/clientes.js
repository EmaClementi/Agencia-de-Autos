const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

router.get('/', async (req, res) => {
    try {
      const clientes = await Cliente.find();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

router.get('/:id', async (req, res) => {
    try {
      const cliente = await Cliente.findById(req.params.id);
      if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

router.post('/', async (req, res) => {
    try {
      const nuevoCliente = new Cliente({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        dni: req.body.dni,
        telefono: req.body.telefono,
      });
      console.log(nuevoCliente);
      const clienteGuardado = await nuevoCliente.save();
      res.status(201).json(clienteGuardado);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });

router.put('/:id', async (req, res) => {
try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

    // Actualizar los campos
    cliente.nombre = req.body.nombre || cliente.nombre;
    cliente.apellido = req.body.apellido || cliente.apellido;
    cliente.email = req.body.email || cliente.email;
    cliente.dni = req.body.dni || cliente.dni;
    cliente.telefono = req.body.telefono || cliente.telefono;

    const clienteActualizado = await cliente.save();
    res.json(clienteActualizado);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

router.delete('/:id', async (req, res) => {
    try {
      const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
      if (!clienteEliminado) return res.status(404).json({ message: 'Cliente no encontrado' });
  
      res.json({ message: 'Cliente eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;