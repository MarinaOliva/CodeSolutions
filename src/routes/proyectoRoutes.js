const express = require('express');
const router = express.Router();

// Controlador
const ProyectoController = require('../controllers/ProyectoController');

// Middlewares
const authMiddleware = require('../middlewares/auth');
const permit = require('../middlewares/rol');


// Listar proyectos - todos logueados
router.get('/', authMiddleware, ProyectoController.listar);


// Crear proyecto - jefe_proyecto y gerente_admin
router.get('/crear', authMiddleware, permit('jefe_proyecto', 'gerente_admin'), ProyectoController.mostrarFormularioCrear);
router.post('/crear', authMiddleware, permit('jefe_proyecto', 'gerente_admin'), ProyectoController.crear);

// Editar proyecto - jefe_proyecto y gerente_admin
router.get('/editar/:id', authMiddleware, permit('jefe_proyecto', 'gerente_admin'), ProyectoController.mostrarFormularioEditar);
router.put('/editar/:id', authMiddleware, permit('jefe_proyecto', 'gerente_admin'), ProyectoController.actualizar);


// Eliminar proyecto - jefe_proyecto y gerente_admin
router.delete('/eliminar/:id', authMiddleware, permit('jefe_proyecto', 'gerente_admin'), ProyectoController.eliminar);

// Quitar un empleado de un proyecto - jefe_proyecto y gerente_admin
router.delete('/:idProyecto/empleados/:idEmpleado', authMiddleware, permit('jefe_proyecto', 'gerente_admin'), ProyectoController.quitarEmpleado);

module.exports = router;
