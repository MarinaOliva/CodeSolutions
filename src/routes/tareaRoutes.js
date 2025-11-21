const express = require('express');
const router = express.Router();

// Controlador
const TareaController = require('../controllers/TareaController');

// Middlewares
const authMiddleware = require('../middlewares/auth');
const permit = require('../middlewares/rol');

// Listar tareas - todos logueados
router.get('/', authMiddleware, TareaController.listar);

// Crear tarea - jefe_proyecto y soporte
router.get('/crear', authMiddleware, permit('jefe_proyecto', 'soporte'), TareaController.mostrarFormularioCrear);
router.post('/crear', authMiddleware, permit('jefe_proyecto', 'soporte'), TareaController.crear);

// Editar tarea - jefe_proyecto, soporte, desarrollador (solo propias)
router.get('/editar/:id', authMiddleware, permit('jefe_proyecto', 'soporte', 'desarrollador'), TareaController.mostrarFormularioEditar);
router.put('/editar/:id', authMiddleware, permit('jefe_proyecto', 'soporte', 'desarrollador'), TareaController.actualizar);

// Eliminar tarea - solo jefe_proyecto
router.delete('/eliminar/:id', authMiddleware, permit('jefe_proyecto'), TareaController.eliminar);

// Cambiar estado tarea - mismo permiso que editar
router.put('/estado/:id', authMiddleware, permit('jefe_proyecto', 'soporte', 'desarrollador'), TareaController.cambiarEstado);

module.exports = router;
