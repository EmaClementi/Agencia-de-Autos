const express = require('express');
const router = express.Router();
const Auto = require('../models/Auto');

router.get('/', async (req, res) => {
  try {
    const autos = await Auto.find({ disponible: true });
    res.json(autos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const auto = await Auto.findById(req.params.id);
    if (!auto) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(auto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.post('/', async (req, res) => {
  const nuevoAuto = new Auto(req.body);
  try {
    const autoGuardado = await nuevoAuto.save();
    res.status(201).json(autoGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const autoActualizado = await Auto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!autoActualizado) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(autoActualizado);
  } catch (error) {
    console.error('Error al actualizar el auto:', error); // Muestra el error en la consola
    res.status(400).json({ message: error.message, error }); // Envía el error en la respuesta
  }
});



router.delete('/:id', async (req, res) => {
  try {
    const autoEliminado = await Auto.findByIdAndDelete(req.params.id);
    if (!autoEliminado) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json({ message: 'Auto eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
