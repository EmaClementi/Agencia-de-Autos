const express = require('express');
const router = express.Router();
const Auto = require('../models/Auto');

router.get('/', async (req, res) => {
  try {
    const { search, sort, tipo } = req.query; // Obtener el tipo desde los parámetros de la query
    let query = { disponible: true };

    // Filtrar por tipo de auto (alquilar o comprar)
    if (tipo) {
      query = { ...query, tipo }; // Agregar el tipo a la consulta
    }

    // Si se proporciona un término de búsqueda, ajusta la consulta
    if (search) {
      query = {
        ...query,
        $or: [
          { modelo: { $regex: search, $options: 'i' } }, // Búsqueda por modelo (insensible a mayúsculas)
          { marca: { $regex: search, $options: 'i' } }   // Búsqueda por marca
        ]
      };
    }

    // Ejecutar la consulta con el filtro
    let autos = await Auto.find(query);

    // Ordenar por precio si se proporciona el parámetro de orden
    if (sort === 'precio_asc') {
      autos = autos.sort((a, b) => a.precio - b.precio); // Orden ascendente
    } else if (sort === 'precio_desc') {
      autos = autos.sort((a, b) => b.precio - a.precio); // Orden descendente
    }

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

router.put('/:id/alquiler', async (req, res) => {
  try {
    const autoActualizado = await Auto.findByIdAndUpdate(
      req.params.id,
      { status: 'alquilado' },
      { new: true }
    );
    if (!autoActualizado) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(autoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Marcar un auto como vendido
router.put('/:id/compra', async (req, res) => {
  try {
    const autoActualizado = await Auto.findByIdAndUpdate(
      req.params.id,
      { status: 'vendido' },
      { new: true }
    );
    if (!autoActualizado) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(autoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.put('/:id/disponible', async (req, res) => {
  try {
    const autoActualizado = await Auto.findByIdAndUpdate(
      req.params.id,
      { status: 'disponible' },
      { new: true }
    );
    if (!autoActualizado) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(autoActualizado);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
