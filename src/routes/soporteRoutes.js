const express = require('express');
const router = express.Router();
const SoporteController = require('../controllers/SoporteController');

// Listar tickets
router.get('/', SoporteController.listar);

// Formulario de crear ticket
router.get('/crear', SoporteController.crearForm);

// Crear ticket (POST)
router.post('/crear', SoporteController.crear);

// Formulario de editar ticket
router.get('/:id/editar', SoporteController.editarForm);

// Actualizar ticket (POST o PUT)
router.post('/:id/editar', SoporteController.actualizar);

// Borrar ticket
router.post('/:id/borrar', SoporteController.borrar);

module.exports = router;
