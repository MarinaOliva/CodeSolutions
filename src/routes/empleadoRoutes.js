const express = require('express');
const router = express.Router();

// Controlador
const EmpleadoController = require('../controllers/EmpleadoController');

// Middlewares
const validarCampos = require('../middlewares/verificarDatos');
const authMiddleware = require('../middlewares/auth');
const permit = require('../middlewares/rol');

// Listar empleados - todos logueados
router.get('/', authMiddleware, EmpleadoController.listar);


// Crear empleado - solo gerente_admin
router.get('/crear', authMiddleware, permit('gerente_admin'), EmpleadoController.mostrarFormulario);
router.post('/crear', authMiddleware, permit('gerente_admin'), validarCampos, EmpleadoController.crear);


// Editar empleado - solo gerente_admin
router.get('/editar/:id', authMiddleware, permit('gerente_admin'), EmpleadoController.mostrarFormularioEditar);
router.put('/editar/:id', authMiddleware, permit('gerente_admin'), validarCampos, EmpleadoController.editar);


// Eliminar empleado - solo gerente_admin
router.delete('/eliminar/:id', authMiddleware, permit('gerente_admin'), EmpleadoController.eliminar);

module.exports = router;
