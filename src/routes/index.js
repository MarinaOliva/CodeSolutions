const express = require('express');
const router = express.Router();

// Ruta principal 
router.get('/', (req, res) => {
  res.render('index', {
    titulo: 'Inicio - Code Solutions',
    mensaje: 'Bienvenido al sistema de gestión'
  });
});

module.exports = router;
