/*const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const dbconfig     = require('./db/dbconfig');
const promosRoutes = require('./routes/offers');
const usersRoutes  = require('./routes/users');
const itemsRoutes  = require('./routes/items');
const storesRoutes  = require('./routes/stores');

const app = express();
app.use(cors());
app.use(express.json());

// RUTAS
app.use('/prc/promo/api', promosRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/stores', storesRoutes);

// CERTIFICADOS HTTPS
const options = {
  key: fs.readFileSync('./certs/key.pem'),
  cert: fs.readFileSync('./certs/cert.pem')
};

// Levantar servidor HTTPS
https.createServer(options, app).listen(process.env.PORT || 9443, () => {
  console.log(`🔐 Servidor HTTPS levantado en puerto ${process.env.PORT || 9443}`);
});
*/
const express = require('express');
const cors = require('cors');
//const sql = require('mssql');
require('dotenv').config();

//const dbconfig     = require('./db/dbconfig');
const promosRoutes = require('./routes/offers');
const usersRoutes  = require('./routes/users');
//const itemsRoutes  = require('./routes/items');
//const storesRoutes = require('./routes/stores');

const app = express();
app.use(cors());
app.use(express.json());

// RUTAS
app.use('/prc/promo/api', promosRoutes);
app.use('/api/users', usersRoutes);
//app.use('/api/items', itemsRoutes);
//app.use('/api/stores', storesRoutes);

// Servidor HTTP normal (Render aplica HTTPS por fuera)
app.listen(process.env.PORT || 3000, () => {
  console.log(`Servidor iniciado en puerto ${process.env.PORT || 3000}`);
});
