// ======================
// Cargar variables de entorno
// ======================
require('dotenv').config();

// ======================
// Dependencias principales
// ======================
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');

// Conexión a la base de datos
const connectDB = require('./src/config/db');
connectDB();

const app = express();

// ======================
// Middlewares globales
// ======================

// Manejo de datos en formato JSON
app.use(express.json());

// Leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// Middleware para cookies
app.use(cookieParser());

// Soporte para PUT y DELETE en formularios
app.use(methodOverride('_method'));

// Carpeta pública para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de registro de solicitudes
const registro = require('./src/middlewares/registro');
app.use(registro);

// ======================
// Middlewares de vistas 
// ======================
const localUser = require('./src/middlewares/localUser');
app.use(localUser);

// Motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src', 'views')); 

// AuthMiddleware
const authMiddleware = require('./src/middlewares/auth');

// ======================
// Rutas
// ======================
const rutasPrincipales = require(path.join(__dirname, 'src', 'routes', 'index'));
const rutasAuth = require(path.join(__dirname, 'src', 'routes', 'authRoutes'));
const rutasProyectos = require(path.join(__dirname, 'src', 'routes', 'proyectoRoutes'));
const rutasEmpleados = require(path.join(__dirname, 'src', 'routes', 'empleadoRoutes'));
const rutasTareas = require(path.join(__dirname, 'src', 'routes', 'tareaRoutes'));
const rutasReportes = require(path.join(__dirname, 'src', 'routes', 'reporteRoutes'));
const rutasProfile = require(path.join(__dirname, 'src', 'routes', 'profileRoutes'));
const soporteRoutes = require('./src/routes/soporteRoutes');

// --- RUTAS PÚBLICAS (sin protección) ---
app.use('/auth', rutasAuth); 
app.use('/auth', rutasProfile);
app.use('/', rutasPrincipales); 

// --- RUTAS PRIVADAS ---
app.use(authMiddleware);
app.use('/proyectos', rutasProyectos);
app.use('/empleados', rutasEmpleados);
app.use('/tareas', rutasTareas);
app.use('/reportes', rutasReportes);
app.use('/soporte', soporteRoutes);

// ======================
// Manejo de errores
// ======================
app.use((req, res) => {
  res.status(404).render('error', {
    titulo: 'Página no encontrada',
    mensajeError: 'Lo sentimos, no se ha podido encontrar lo que busca.'
  });
});

app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).render('error', {
    titulo: 'Error en el sistema',
    mensajeError: 'Ocurrió un problema. Por favor intente más tarde.'
  });
});

// ======================
// Levantar servidor solo si se ejecuta directamente
// ======================
if (require.main === module) {
  const PUERTO = process.env.PORT || 3000;
  app.listen(PUERTO, () => {
    console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
  });
}

// ======================
// Exportar la app para usar en tests
// ======================
module.exports = app;
