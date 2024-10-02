const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const autosRouter = require('./routes/autos');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error de conexión:', err));

app.use(cors());
app.use(express.json());

app.use('/api/autos', autosRouter);

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
