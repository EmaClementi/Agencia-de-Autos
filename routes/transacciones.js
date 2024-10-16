const express = require('express');
const router = express.Router();
const Transaccion = require('../models/Transaccion');

router.get('/', async (req, res) => {
    try {
      const transacciones = await Transaccion.find().populate('cliente').populate('auto');
      res.json(transacciones);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
      const transaccion = await Transaccion.findById(req.params.id).populate('cliente').populate('auto');
      if (!transaccion) return res.status(404).json({ message: 'Transacción no encontrada' });
      res.json(transaccion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
router.post('/', async (req, res) => {
  const { clienteId, autoId, tipoTransaccion } = req.body;

  // Asegúrate de que no estés verificando 'estado' si no es necesario

  try {
    const nuevaTransaccion = new Transaccion({
      cliente: req.body.cliente,
      auto: req.body.auto,
      tipo: req.body.tipo
    });

    const transaccionGuardada = await nuevaTransaccion.save();
    res.status(201).json(transaccionGuardada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
    try {
      const transaccion = await Transaccion.findById(req.params.id);
      if (!transaccion) return res.status(404).json({ message: 'Transacción no encontrada' });
  
      transaccion.cliente = req.body.cliente || transaccion.cliente;
      transaccion.auto = req.body.auto || transaccion.auto;
      transaccion.tipo = req.body.tipo || transaccion.tipo;
      transaccion.estado = req.body.estado || transaccion.estado;
  
      const transaccionActualizada = await transaccion.save();
      res.json(transaccionActualizada);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const transaccion = await Transaccion.findByIdAndDelete(req.params.id);
      if (!transaccion) return res.status(404).json({ message: 'Transacción no encontrada' });
  
      res.json({ message: 'Transacción eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});
  
module.exports = router;