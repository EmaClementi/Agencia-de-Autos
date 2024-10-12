const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const autosRouter = require('./routes/autos');
const transaccionesRouter = require('./routes/transacciones');
const clientesRouter = require('./routes/clientes');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
    
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error de conexión:', err));

app.use(cors());
app.use(express.json());

app.use('/api/autos', autosRouter);
app.use('/api/transacciones', transaccionesRouter);
app.use('/api/clientes', clientesRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
