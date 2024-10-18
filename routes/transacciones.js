const express = require('express');
const router = express.Router();
const Transaccion = require('../models/Transaccion');

/**
 * @swagger
 * tags:
 *   name: Transacciones
 *   description: Operaciones relacionadas con transacciones
 */

/**
 * @swagger
 * /api/transacciones:
 *   get:
 *     summary: Obtener todas las transacciones
 *     tags: [Transacciones]
 *     responses:
 *       200:
 *         description: Lista de transacciones
 *       500:
 *         description: Error del servidor
 */
router.get('/', async (req, res) => {
    try {
        const transacciones = await Transaccion.find()
            .populate('cliente')
            .populate('auto');
        res.json(transacciones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/transacciones/{id}:
 *   get:
 *     summary: Obtener una transacción por ID
 *     tags: [Transacciones]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la transacción
 *     responses:
 *       200:
 *         description: Transacción encontrada
 *       404:
 *         description: Transacción no encontrada
 *       500:
 *         description: Error del servidor
 */
router.get('/:id', async (req, res) => {
    try {
        const transaccion = await Transaccion.findById(req.params.id)
            .populate('cliente')
            .populate('auto');
        if (!transaccion) return res.status(404).json({ message: 'Transacción no encontrada' });
        res.json(transaccion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/transacciones:
 *   post:
 *     summary: Crear una nueva transacción
 *     tags: [Transacciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clienteId:
 *                 type: string
 *                 example: "12345678" # DNI del cliente
 *                 description: DNI del cliente que realiza la transacción.
 *               autoId:
 *                 type: string
 *                 example: "607d1c1e814f4e1b4c7d2d2f" # ID del auto
 *                 description: ID del auto asociado a la transacción.
 *               tipoTransaccion:
 *                 type: string
 *                 enum: [compra, alquiler]
 *                 example: "compra"
 *                 description: Tipo de transacción, ya sea "compra" o "alquiler".
 *     responses:
 *       201:
 *         description: Transacción creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "607d1c1e814f4e1b4c7d2d2f" # ID de la transacción creada
 *                 cliente:
 *                   type: string
 *                   example: "12345678" # DNI del cliente
 *                 auto:
 *                   type: string
 *                   example: "607d1c1e814f4e1b4c7d2d2f" # ID del auto
 *                 tipo:
 *                   type: string
 *                   example: "compra"
 *                 estado:
 *                   type: string
 *                   example: "pendiente" # Estado inicial por defecto
 *       400:
 *         description: Error en los datos de la solicitud
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error en los datos de la solicitud"
 */
router.post('/', async (req, res) => {
    const { clienteId, autoId, tipoTransaccion } = req.body;

    try {
        const nuevaTransaccion = new Transaccion({
            cliente: clienteId, // Asegúrate de pasar el DNI correcto
            auto: autoId,       // ID del auto
            tipo: tipoTransaccion // Tipo de transacción
        });

        const transaccionGuardada = await nuevaTransaccion.save();
        res.status(201).json(transaccionGuardada);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * @swagger
 * /api/transacciones/{id}:
 *   put:
 *     summary: Actualizar una transacción existente
 *     tags: [Transacciones]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la transacción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cliente:
 *                 type: string
 *               auto:
 *                 type: string
 *               tipo:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transacción actualizada exitosamente
 *       404:
 *         description: Transacción no encontrada
 *       400:
 *         description: Error en los datos de la solicitud
 */
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

/**
 * @swagger
 * /api/transacciones/{id}:
 *   delete:
 *     summary: Eliminar una transacción
 *     tags: [Transacciones]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID de la transacción
 *     responses:
 *       200:
 *         description: Transacción eliminada exitosamente
 *       404:
 *         description: Transacción no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', async (req, res) => {
    try {
        const transaccionEliminada = await Transaccion.findByIdAndDelete(req.params.id);
        if (!transaccionEliminada) return res.status(404).json({ message: 'Transacción no encontrada' });

        res.json({ message: 'Transacción eliminada con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
