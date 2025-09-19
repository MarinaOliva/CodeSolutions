const express = require('express');
const router = express.Router();

const ReporteController = require('../controllers/ReporteController');

// Generar reporte de horas trabajadas por empleado
router.get('/horas', ReporteController.generarHoras);

// Generar reporte de avance de proyectos
router.get('/avance', ReporteController.generarAvance);

// Ver historial de reportes generados
router.get('/historial', ReporteController.historial);

// Ver detalle de un reporte específico
router.get('/:id', ReporteController.verDetalle);

module.exports = router;
