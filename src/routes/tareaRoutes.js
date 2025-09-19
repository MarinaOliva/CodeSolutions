const express = require('express');
const router = express.Router();

// Importar el controlador de tareas
const TareaController = require('../controllers/TareaController');

// Listar todas las tareas
router.get('/', TareaController.listar);

// Mostrar formulario para crear nueva tarea
router.get('/crear', TareaController.mostrarFormulario);

// Guardar una nueva tarea
router.post('/crear', TareaController.crear);

// Mostrar formulario para editar tarea
router.get('/editar/:id', TareaController.mostrarFormularioEditar);

// Guardar los cambios de la tarea editada
router.post('/editar/:id', TareaController.editar);

// Eliminar una tarea
router.post('/eliminar/:id', TareaController.eliminar);

// Cambiar el estado de una tarea
router.post('/estado/:id', TareaController.cambiarEstado);

// Asignar un empleado a una tarea
router.post('/asignar/:id', TareaController.asignarEmpleado);

module.exports = router;
