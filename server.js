const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const autosRouter = require('./routes/autos');
const transaccionesRouter = require('./routes/transacciones');
const clientesRouter = require('./routes/clientes');
const cors = require('cors');

// Importa la configuración de Swagger
const { swaggerUi, swaggerDocs } = require('./swagger');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, {})
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/autos', autosRouter);
app.use('/api/transacciones', transaccionesRouter);
app.use('/api/clientes', clientesRouter);

// Ruta para la documentación de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});