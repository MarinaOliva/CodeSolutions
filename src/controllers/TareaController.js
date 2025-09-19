const fs = require('fs').promises;
const Tarea = require('../models/Tarea');

const archivoTareas = './data/tareas.json';
const archivoEmpleados = './data/empleados.json';
const archivoProyectos = './data/proyectos.json';

// Función para leer datos almacenados en un archivo JSON
async function leerDatos(archivo) {
  try {
    const datos = await fs.readFile(archivo, 'utf8');
    return JSON.parse(datos);
  } catch {
    await fs.writeFile(archivo, '[]');
    return [];
  }
}

// Función para guardar tareas
async function guardarTareas(tareas) {
  await fs.writeFile(archivoTareas, JSON.stringify(tareas, null, 2));
}

module.exports = {
  // Listar todas las tareas
  listar: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);
      const empleados = await leerDatos(archivoEmpleados);
      const proyectos = await leerDatos(archivoProyectos);

      res.render('tareas/listar', { tareas, empleados, proyectos });
    } catch {
      res.status(500).render('tareas/listar', { tareas: [], empleados: [], proyectos: [] });
    }
  },

  // Mostrar formulario de creación
  mostrarFormularioCrear: async (req, res) => {
    const empleados = await leerDatos(archivoEmpleados);
    const proyectos = await leerDatos(archivoProyectos);
    res.render('tareas/crear', { empleados, proyectos });
  },

  // Mostrar formulario de edición
  mostrarFormularioEditar: async (req, res) => {
    const tareas = await leerDatos(archivoTareas);
    const empleados = await leerDatos(archivoEmpleados);
    const proyectos = await leerDatos(archivoProyectos);

    const tarea = tareas.find(t => t.id === req.params.id);
    if (!tarea) return res.status(404).render('error', { mensajeError: 'Tarea no encontrada' });

    res.render('tareas/editar', { tarea, empleados, proyectos });
  },

  // Crear una nueva tarea
  crear: async (req, res) => {
    const { proyectoId, nombre, horasEstimadas, horasRegistradas, empleadoId } = req.body;
    try {
      const tareas = await leerDatos(archivoTareas);
      const nuevaTarea = new Tarea(proyectoId, nombre, horasEstimadas, horasRegistradas, empleadoId);
      tareas.push(nuevaTarea);
      await guardarTareas(tareas);
      res.redirect('/tareas');
    } catch {
      res.render('tareas/crear', { error: true, datos: req.body });
    }
  },

  // Actualizar tarea
  actualizar: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);
      const tareasActualizadas = tareas.map(t =>
        t.id === req.params.id ? { ...t, ...req.body } : t
      );
      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch {
      res.render('tareas/editar', { error: true, tarea: req.body });
    }
  },

  // Cambiar estado de la tarea
  cambiarEstado: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);
      const tareasActualizadas = tareas.map(t =>
        t.id === req.params.id ? { ...t, estado: req.body.estado } : t
      );
      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch {
      res.status(500).redirect('/tareas');
    }
  },

  // Asignar empleado a la tarea
  asignarEmpleado: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);
      const tareasActualizadas = tareas.map(t =>
        t.id === req.params.id ? { ...t, empleadoId: req.body.empleadoId } : t
      );
      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch {
      res.status(500).redirect('/tareas');
    }
  },

  // Eliminar tarea (baja lógica)
  eliminar: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);
      const tareasActualizadas = tareas.map(t =>
        t.id === req.params.id ? { ...t, estado: 'eliminada' } : t
      );
      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch {
      res.status(500).redirect('/tareas');
    }
  }
};
