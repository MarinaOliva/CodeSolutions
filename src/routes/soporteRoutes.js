const express = require('express');
const router = express.Router();
const SoporteController = require('../controllers/SoporteController');

// IMPORTAR MIDDLEWARES
const authMiddleware = require('../middlewares/auth'); 
const roleMiddleware = require('../middlewares/rol'); 

router.use(authMiddleware);

// Listar tickets
router.get('/', SoporteController.listar);

// Formulario de crear ticket
router.get('/crear', 
    roleMiddleware('soporte', 'gerente_admin'), 
    SoporteController.crearForm
);
// Crear ticket (POST)
router.post('/crear', 
    roleMiddleware('soporte', 'gerente_admin'), 
    SoporteController.crear
);

// Formulario de editar ticket
router.get('/:id/editar', 
    roleMiddleware('soporte', 'gerente_admin', 'jefe_proyecto'), 
    SoporteController.editarForm
);
// Actualizar ticket (POST o PUT)
router.post('/:id/editar', 
    roleMiddleware('soporte', 'gerente_admin', 'jefe_proyecto'), 
    SoporteController.actualizar
);

// Borrar ticket
router.post('/:id/borrar', 
    roleMiddleware('gerente_admin', 'jefe_proyecto','soporte'), 
    SoporteController.borrar
);

module.exports = router;