const express = require('express');
const router = express.Router();
const Auto = require('../models/Auto');

/**
 * @swagger
 * tags:
 *   name: Autos
 *   description: API para manejar los autos
 */

/**
 * @swagger
 * /api/autos:
 *   get:
 *     summary: Obtener lista de autos
 *     tags: [Autos]
 *     parameters:
 *       - name: search
 *         in: query
 *         description: Término de búsqueda para el modelo o marca
 *         required: false
 *         schema:
 *           type: string
 *       - name: sort
 *         in: query
 *         description: Ordenar autos por precio (precio_asc o precio_desc)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [precio_asc, precio_desc]
 *       - name: tipo
 *         in: query
 *         description: Tipo de auto (compra o alquiler)
 *         required: false
 *         schema:
 *           type: string
 *           enum: [compra, alquiler]
 *     responses:
 *       200:
 *         description: Lista de autos disponibles
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const { search, sort, tipo } = req.query; // Obtener el tipo desde los parámetros de la query
    let query = { status: 'disponible' }; // Cambié "disponible" a "status" para que coincida con tu modelo

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

/**
 * @swagger
 * /api/autos/{id}:
 *   get:
 *     summary: Obtener un auto por ID
 *     tags: [Autos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del auto a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auto encontrado
 *       404:
 *         description: Auto no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:id', async (req, res) => {
  try {
    const auto = await Auto.findById(req.params.id);
    if (!auto) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(auto);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/autos:
 *   post:
 *     summary: Crear un nuevo auto
 *     tags: [Autos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               año:
 *                 type: number
 *               tipo:
 *                 type: string
 *                 enum: [compra, alquiler]
 *               precio:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [disponible, alquilado, vendido]
 *               detalles:
 *                 type: string
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Auto creado
 *       400:
 *         description: Error al crear el auto
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  const nuevoAuto = new Auto(req.body);
  try {
    const autoGuardado = await nuevoAuto.save();
    res.status(201).json(autoGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/autos/{id}:
 *   put:
 *     summary: Actualizar un auto por ID
 *     tags: [Autos]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del auto a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *               modelo:
 *                 type: string
 *               año:
 *                 type: number
 *               tipo:
 *                 type: string
 *                 enum: [compra, alquiler]
 *               precio:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [disponible, alquilado, vendido]
 *               detalles:
 *                 type: string
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Auto actualizado
 *       404:
 *         description: Auto no encontrado
 *       400:
 *         description: Error al actualizar el auto
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id', async (req, res) => {
  try {
    const autoActualizado = await Auto.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!autoActualizado) return res.status(404).json({ message: 'Auto no encontrado' });
    res.json(autoActualizado);
  } catch (error) {
    console.error('Error al actualizar el auto:', error);
    res.status(400).json({ message: error.message, error });
  }
});
/**
 * @swagger
 * /api/autos/{id}:
 *   delete:
 *     summary: Eliminar un auto por su ID
 *     tags: [Autos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del auto a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Auto eliminado con éxito
 *       404:
 *         description: Auto no encontrado
 *       500:
 *         description: Error del servidor
 */


  router.delete('/:id', async (req, res) => {
    try {
      const autoEliminado = await Auto.findByIdAndDelete(req.params.id);
      if (!autoEliminado) return res.status(404).json({ message: 'Auto no encontrado' });
      res.json({ message: 'Auto eliminado' });
    } catch (error) {
      console.error('Error al eliminar el auto:', error);
      res.status(500).json({ message: error.message });
    }
});


module.exports = router;