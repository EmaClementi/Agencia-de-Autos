const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: API para manejar los clientes
 */

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener lista de clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida con éxito
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/clientes/{dni}:
 *   get:
 *     summary: Obtener un cliente por DNI
 *     tags: [Clientes]
 *     parameters:
 *       - name: dni
 *         in: path
 *         required: true
 *         description: DNI del cliente a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:dni', async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ dni: req.params.dni });
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               dni:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Error al crear el cliente
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', async (req, res) => {
  try {
    const nuevoCliente = new Cliente({
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      email: req.body.email,
      dni: req.body.dni,
      telefono: req.body.telefono,
    });

    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/clientes/{dni}:
 *   put:
 *     summary: Actualizar un cliente por DNI
 *     tags: [Clientes]
 *     parameters:
 *       - name: dni
 *         in: path
 *         required: true
 *         description: DNI del cliente a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       404:
 *         description: Cliente no encontrado
 *       400:
 *         description: Error al actualizar el cliente
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:dni', async (req, res) => {
  try {
    const cliente = await Cliente.findOne({ dni: req.params.dni });
    if (!cliente) return res.status(404).json({ message: 'Cliente no encontrado' });

    cliente.nombre = req.body.nombre || cliente.nombre;
    cliente.apellido = req.body.apellido || cliente.apellido;
    cliente.email = req.body.email || cliente.email;
    cliente.telefono = req.body.telefono || cliente.telefono;

    const clienteActualizado = await cliente.save();
    res.json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/clientes/{dni}:
 *   delete:
 *     summary: Eliminar un cliente por su DNI
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: dni
 *         required: true
 *         description: DNI del cliente a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete('/:dni', async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findOneAndDelete({ dni: req.params.dni });
    if (!clienteEliminado) return res.status(404).json({ message: 'Cliente no encontrado' });

    res.json({ message: 'Cliente eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
