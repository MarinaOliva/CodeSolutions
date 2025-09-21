const fs = require('fs').promises;
const Tarea = require('../models/Tarea');
const path = require('path');

// ======================
// Archivos JSON
// ======================
const archivoTareas = path.join(__dirname, '../data/tareas.json');
const archivoEmpleados = path.join(__dirname, '../data/empleados.json');
const archivoProyectos = path.join(__dirname, '../data/proyectos.json');

// Lista de estados válidos para tareas
const estadosValidos = ['Pendiente', 'En progreso', 'Finalizado', 'Eliminada'];

// ======================
// Función para leer datos almacenados en un archivo JSON
// ======================
async function leerDatos(archivo) {
  try {
    const datos = await fs.readFile(archivo, 'utf8');
    return JSON.parse(datos);
  } catch {
    // Si falla la lectura, inicializa el archivo con un array vacío
    await fs.writeFile(archivo, '[]');
    return [];
  }
}

// ======================
// Función para guardar tareas
// ======================
async function guardarTareas(tareas) {
  await fs.writeFile(archivoTareas, JSON.stringify(tareas, null, 2));
}

// ======================
// Controller de Tareas
// ======================
module.exports = {
  // ======================
  // Listar todas las tareas
  // ======================
  listar: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);
      const empleados = await leerDatos(archivoEmpleados);
      const proyectos = await leerDatos(archivoProyectos);

      // Normalizar estados y empleadosAsignados
      const tareasNormalizadas = tareas.map(t => {
        // Normalizar estado
        let estadoNormalizado = 'Pendiente';
        if (t.estado) {
          const e = t.estado.toLowerCase();
          if (e === 'en proceso') estadoNormalizado = 'En progreso';
          else if (e === 'pendiente') estadoNormalizado = 'Pendiente';
          else if (e === 'finalizado') estadoNormalizado = 'Finalizado';
          else if (e === 'eliminada') estadoNormalizado = 'Eliminada';
          else estadoNormalizado = t.estado;
        }

        // Normalizar empleadosAsignados para compatibilidad
        const empleadosAsignados = Array.isArray(t.empleadosAsignados)
          ? t.empleadosAsignados
          : (t.empleadoId ? [t.empleadoId] : []);

        return { ...t, estado: estadoNormalizado, empleadosAsignados };
      });

      res.render('tareas/listar', { tareas: tareasNormalizadas, empleados, proyectos, estadosValidos });
    } catch (error) {
      console.error('Error listando tareas:', error);
      res.status(500).render('tareas/listar', { tareas: [], empleados: [], proyectos: [], estadosValidos });
    }
  },

  // ======================
  // Mostrar formulario de creación
  // ======================
  mostrarFormularioCrear: async (req, res) => {
    const empleados = await leerDatos(archivoEmpleados);
    const proyectos = await leerDatos(archivoProyectos);
    res.render('tareas/crear', { empleados, proyectos, estadosValidos });
  },

  // ======================
  // Mostrar formulario de edición
  // ======================
  mostrarFormularioEditar: async (req, res) => {
    const tareas = await leerDatos(archivoTareas);
    const empleados = await leerDatos(archivoEmpleados);
    const proyectos = await leerDatos(archivoProyectos);

    const tarea = tareas.find(t => t.id === req.params.id);
    if (!tarea) return res.status(404).render('error', { mensajeError: 'Tarea no encontrada' });

    res.render('tareas/editar', { tarea, empleados, proyectos, estadosValidos });
  },

  // ======================
  // Crear una nueva tarea
  // ======================
  crear: async (req, res) => {
    const { proyectoId, nombre, horasEstimadas, horasRegistradas, estado, empleadosAsignados } = req.body;
    try {
      const tareas = await leerDatos(archivoTareas);

      // Normalizar empleadosAsignados a array
      const empleadosArray = empleadosAsignados
        ? Array.isArray(empleadosAsignados)
          ? empleadosAsignados
          : [empleadosAsignados]
        : [];

      // Crear la tarea respetando el orden de parámetros del constructor
      // NOTA: Como el modelo usa empleadoId, tomamos solo el primero de los seleccionados
      const nuevaTarea = new Tarea(
        proyectoId,
        nombre,
        parseFloat(horasRegistradas) || 0,
        empleadosArray.length > 0 ? empleadosArray[0] : null,
        estado || 'Pendiente'
      );

      tareas.push(nuevaTarea);
      await guardarTareas(tareas);
      res.redirect('/tareas');
    } catch (error) {
      console.error('Error creando tarea:', error);
      const empleados = await leerDatos(archivoEmpleados);
      const proyectos = await leerDatos(archivoProyectos);
      res.render('tareas/crear', { 
        error: true, 
        datos: req.body, 
        empleados, 
        proyectos, 
        estadosValidos 
      });
    }
  },

  // ======================
  // Actualizar tarea
  // ======================
  actualizar: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);

      // Normalizar empleadosAsignados a array
      const empleadosAsignados = req.body.empleadosAsignados
        ? Array.isArray(req.body.empleadosAsignados)
          ? req.body.empleadosAsignados
          : [req.body.empleadosAsignados]
        : [];

      const tareasActualizadas = tareas.map(t =>
        t.id === req.params.id
          ? {
              ...t,
              nombre: req.body.nombre,
              proyectoId: req.body.proyectoId,
              horasEstimadas: req.body.horasEstimadas || 0,
              horasRegistradas: req.body.horasRegistradas || 0,
              estado: req.body.estado,
              empleadosAsignados
            }
          : t
      );

      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      const empleados = await leerDatos(archivoEmpleados);
      const proyectos = await leerDatos(archivoProyectos);
      res.render('tareas/editar', { error: true, tarea: req.body, empleados, proyectos, estadosValidos });
    }
  },

  // ======================
  // Cambiar estado de la tarea
  // ======================
  cambiarEstado: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);
      const tareasActualizadas = tareas.map(t =>
        t.id === req.params.id ? { ...t, estado: req.body.estado } : t
      );
      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch (error) {
      console.error('Error cambiando estado de la tarea:', error);
      res.status(500).redirect('/tareas');
    }
  },

  // ======================
  // Eliminar tarea (baja lógica)
  // ======================
  eliminar: async (req, res) => {
    try {
      const tareas = await leerDatos(archivoTareas);
      const tareasActualizadas = tareas.map(t =>
        t.id === req.params.id ? { ...t, estado: 'Eliminada' } : t
      );
      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      res.status(500).redirect('/tareas');
    }
  }
};
