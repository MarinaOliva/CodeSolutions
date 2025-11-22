const express = require('express');
const router = express.Router();

// Controlador
const TareaController = require('../controllers/TareaController');

// Middlewares
const authMiddleware = require('../middlewares/auth');
const permit = require('../middlewares/rol');
const localUser = require('../middlewares/localUser'); 

// Listar tareas - todos logueados
router.get('/', authMiddleware, localUser, TareaController.listar);

// Crear tarea - jefe_proyecto, soporte, gerente_admin
router.get('/crear', authMiddleware, localUser, permit('gerente_admin', 'jefe_proyecto', 'soporte'), TareaController.mostrarFormularioCrear);
router.post('/crear', authMiddleware, localUser, permit('gerente_admin', 'jefe_proyecto', 'soporte'), TareaController.crear);

// Editar tarea - jefe_proyecto, soporte, desarrollador (solo propias), gerente_admin
router.get('/editar/:id', authMiddleware, localUser, permit('gerente_admin', 'jefe_proyecto', 'soporte', 'desarrollador'), TareaController.mostrarFormularioEditar);
router.put('/editar/:id', authMiddleware, localUser, permit('gerente_admin', 'jefe_proyecto', 'soporte', 'desarrollador'), TareaController.actualizar);

// Eliminar tarea - jefe_proyecto, gerente_admin
router.delete('/eliminar/:id', authMiddleware, localUser, permit('gerente_admin', 'jefe_proyecto'), TareaController.eliminar);

// Cambiar estado tarea - jefe_proyecto, soporte, desarrollador, gerente_admin
router.put('/estado/:id', authMiddleware, localUser, permit('gerente_admin', 'jefe_proyecto', 'soporte', 'desarrollador'), TareaController.cambiarEstado);

module.exports = router;
