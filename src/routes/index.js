const express = require('express');
const router = express.Router();

// Ruta principal (ya protegida por authMiddleware en app.js)
router.get('/', (req, res) => {
  res.render('index', {
    titulo: 'Inicio - Code Solutions',
    mensaje: 'Bienvenido al sistema de gestión'
    // user ya está disponible gracias a localUser
  });
});

module.exports = router;
