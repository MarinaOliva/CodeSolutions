// controllers/ProjectController.js

// Importación de módulos
const fs = require('fs').promises; 
const Proyecto = require('../modelos/Proyecto'); 

// Ruta del archivo JSON donde se almacenan los proyectos
const archivoProyectos = './datos/projects.json';

// Función para obtener todos los proyectos
const obtenerProyectos = async () => {
  try {
    const datos = await fs.readFile(archivoProyectos, 'utf8');
    return JSON.parse(datos).filter(p => p?.nombre); // Evita proyectos sin nombre
  } catch {
    // Si el archivo no existe, se crea uno vacío
    await fs.writeFile(archivoProyectos, '[]');
    return [];
  }
};

// Función para guardar proyectos en el JSON
const guardarProyectos = async (proyectos) => {
  await fs.writeFile(archivoProyectos, JSON.stringify(proyectos, null, 2));
};

// Exportación del controlador con operaciones CRUD
module.exports = {
  // Listar todos los proyectos
  listar: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      res.render('projects/list', { proyectos });
    } catch {
      res.render('projects/list', { proyectos: [] });
    }
  },

  // Mostrar formulario de creación
  mostrarFormularioCrear: (req, res) => res.render('projects/create'),

  // Mostrar formulario de edición con los datos del proyecto
  mostrarFormularioEditar: async (req, res) => {
    const proyectos = await obtenerProyectos();
    const proyecto = proyectos.find(p => p.id === req.params.id);
    res.render('projects/edit', { proyecto });
  },

  // Crear un nuevo proyecto
  crear: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      // Crear proyecto con nombre, descripción y cliente
      const nuevoProyecto = new Proyecto(req.body.nombre, req.body.descripcion, req.body.cliente);
      proyectos.push(nuevoProyecto);
      await guardarProyectos(proyectos);
      res.redirect('/projects');
    } catch {
      res.render('projects/create', { error: true, datos: req.body });
    }
  },

  // Actualizar un proyecto existente
  actualizar: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      const actualizados = proyectos.map(p =>
        p.id === req.params.id
          ? {
              ...p,
              nombre: req.body.nombre || p.nombre,
              descripcion: req.body.descripcion || p.descripcion,
              cliente: req.body.cliente || p.cliente,
              estado: req.body.estado || p.estado
            }
          : p
      );
      await guardarProyectos(actualizados);
      res.redirect('/projects');
    } catch {
      res.render('projects/edit', { error: true, proyecto: req.body });
    }
  },

  // Eliminar un proyecto (baja lógica)
  eliminar: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      // Baja lógica: marcar como inactivo en vez de eliminar
      const actualizados = proyectos.map(p =>
        p.id === req.params.id ? { ...p, estado: 'inactivo' } : p
      );
      await guardarProyectos(actualizados);
      res.redirect('/projects');
    } catch {
      res.status(500).redirect('/projects');
    }
  }
};
