// controllers/ProjectController.js

// Importación de módulos
const fs = require('fs').promises; 
const Proyecto = require('../models/Proyecto'); 

// Ruta del archivo JSON donde se almacenan los proyectos
const archivoProyectos = './data/projectos.json';

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
      res.render('proyectos/listar', { proyectos });
    } catch {
      res.render('proyectos/listar', { proyectos: [] });
    }
  },

  // Mostrar formulario de creación
  mostrarFormularioCrear: (req, res) => res.render('proyectos/crear'),

  // Mostrar formulario de edición con los datos del proyecto
  mostrarFormularioEditar: async (req, res) => {
    const proyectos = await obtenerProyectos();
    const proyecto = proyectos.find(p => p.id === req.params.id);
    res.render('proyectos/editar', { proyecto });
  },

  // Crear un nuevo proyecto
  crear: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      // Crear proyecto con nombre, descripción y cliente
      const nuevoProyecto = new Proyecto(req.body.nombre, req.body.descripcion, req.body.cliente);
      proyectos.push(nuevoProyecto);
      await guardarProyectos(proyectos);
      res.redirect('/proyectos');
    } catch {
      res.render('proyectos/crear', { error: true, datos: req.body });
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
      res.redirect('/proyectos');
    } catch {
      res.render('proyectos/editar', { error: true, proyecto: req.body });
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
      res.redirect('/proyectos');
    } catch {
      res.status(500).redirect('/proyectos');
    }
  }
};
