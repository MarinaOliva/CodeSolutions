// Importación de módulos
const Proyecto = require('../models/Proyecto');
const Empleado = require('../models/Empleado');
const Tarea = require('../models/Tarea');

// Lista de estados válidos
const estadosValidos = ["Pendiente", "En progreso", "Finalizado", "Cancelado"];

// Exportación del controlador con operaciones CRUD
module.exports = {

  // Listar todos los proyectos
  listar: async (req, res) => {
    try {
      const proyectos = await Proyecto.find({ estado: { $nin: ['Cancelado', 'Finalizado'] } }).lean();
      const empleados = await Empleado.find().lean();
      const tareas = await Tarea.find().lean();

      const proyectosConNombres = proyectos.map(proyecto => {
        const idsManual = proyecto.empleadosAsignados?.map(e => e.toString()) || [];
        const idsDeTareas = tareas
          .filter(t => t.proyectoId?.toString() === proyecto._id.toString())
          .flatMap(t => t.empleadosAsignados?.map(e => e.toString()) || []);
        // Unir y eliminar duplicados
        const idsUnidos = [...new Set([...idsManual, ...idsDeTareas])];
        const empleadosAsignados = empleados
          .filter(e => idsUnidos.includes(e._id.toString()))
          .map(e => ({ nombre: e.nombre, rol: e.rol, id: e._id }));

        return { ...proyecto, empleadosAsignados };
      });

      res.render('proyectos/listar', { proyectos: proyectosConNombres });
    } catch (error) {
      console.error('Error listando proyectos:', error);
      res.render('proyectos/listar', { proyectos: [] });
    }
  },

  // Mostrar formulario de creación 
  mostrarFormularioCrear: async (req, res) => {
    try {
      const empleados = await Empleado.find().lean();
      res.render('proyectos/crear', { empleados, estadosValidos, datos: {} });
    } catch (error) {
      console.error('Error cargando empleados para crear proyecto:', error);
      res.render('proyectos/crear', { empleados: [], estadosValidos, datos: {} });
    }
  },

  // Función mostrarFormularioEditar:
  // Carga la lista unificada de empleados
  mostrarFormularioEditar: async (req, res) => {
    try {
      const proyecto = await Proyecto.findById(req.params.id).lean();
      const empleados = await Empleado.find().lean();
      const tareas = await Tarea.find({ proyectoId: req.params.id }).lean();

      // Lógica de unificación:
      // IDs de empleados asignados manualmente
      const idsManual = proyecto.empleadosAsignados?.map(e => e.toString()) || [];
      // IDs de empleados de tareas de este proyecto
      const idsDeTareas = tareas
        .flatMap(t => t.empleadosAsignados?.map(e => e.toString()) || []);
      // Unir y eliminar duplicados
      const idsUnidos = [...new Set([...idsManual, ...idsDeTareas])];

      //Proyecto para mostrar en la vista
      const proyectoParaVista = {
        ...proyecto,
        empleadosAsignados: idsUnidos
      };

      res.render('proyectos/editar', {
        proyecto: proyectoParaVista, // Pasa el proyecto modificado
        empleados,
        estadosValidos
      });

    } catch (error) {
      console.error('Error cargando formulario de edición:', error);
      // En caso de error, enviar un objeto 'proyecto' vacío o parcial
      const empleadosFallback = await Empleado.find().lean();
      res.render('proyectos/editar', {
        proyecto: { ...req.body, _id: req.params.id, empleadosAsignados: [] },
        empleados: empleadosFallback,
        estadosValidos
      });
    }
  },

  // Crear un nuevo proyecto 
  crear: async (req, res) => {
    try {
      // Normalizar los empleados asignados (checkboxes)
      let empleadosAsignados = [];
      if (req.body.empleadosAsignados) {
        empleadosAsignados = Array.isArray(req.body.empleadosAsignados)
          ? req.body.empleadosAsignados
          : [req.body.empleadosAsignados];
      }

      const nuevoProyecto = new Proyecto({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        cliente: req.body.cliente,
        estado: req.body.estado || 'Pendiente',
        empleadosAsignados
      });

      await nuevoProyecto.save();

      console.log('Proyecto creado correctamente:', nuevoProyecto);
      res.redirect('/proyectos');
    } catch (error) {
      console.error('Error al crear proyecto:', error);
      const empleados = await Empleado.find().lean();
      res.render('proyectos/crear', { error: true, datos: req.body, empleados, estadosValidos });
    }
  },

  // FUNCIÓN actualizar
  // Compara la lista nueva con la vieja y actualiza proyecto + tareas
  actualizar: async (req, res) => {
    const idProyecto = req.params.id;

    try {
      // Obtener la NUEVA lista de IDs del formulario 
      let idsNuevos = [];
      if (req.body.empleadosAsignados) {
        idsNuevos = Array.isArray(req.body.empleadosAsignados)
          ? req.body.empleadosAsignados
          : [req.body.empleadosAsignados];
      }
      idsNuevos = idsNuevos.map(String);


      // Obtener la lista vieja de IDs 
      const proyectoActual = await Proyecto.findById(idProyecto); // Sin .lean()
      const tareas = await Tarea.find({ proyectoId: idProyecto }).lean();

      const idsManual = proyectoActual.empleadosAsignados?.map(e => e.toString()) || [];
      const idsDeTareas = tareas
        .flatMap(t => t.empleadosAsignados?.map(e => e.toString()) || []);
      const idsViejosUnidos = [...new Set([...idsManual, ...idsDeTareas])];

      const idsParaQuitar = idsViejosUnidos.filter(id => !idsNuevos.includes(id));

      const idsParaAgregar = idsNuevos.filter(id => !idsManual.includes(id));


      // Quitar empleados
      if (idsParaQuitar.length > 0) {
        // Quitar de las tareas del proyecto
        await Tarea.updateMany(
          { proyectoId: idProyecto },
          { $pull: { empleadosAsignados: { $in: idsParaQuitar } } } 
        );
      }

      // Actualizar el proyecto
      const idsManualActualizados = idsManual
        .filter(id => !idsParaQuitar.includes(id)) 
        .concat(idsParaAgregar);

      const nuevaListaManual = [...new Set(idsManualActualizados)];
      
      // Capturar el nuevo estado que viene del formulario
      const nuevoEstado = req.body.estado;

      await Proyecto.findByIdAndUpdate(
        idProyecto,
        {
          nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          cliente: req.body.cliente,
          estado: nuevoEstado, 
          empleadosAsignados: nuevaListaManual
        },
        { new: true, runValidators: true }
      );

      // Actualización de tareas acorde al estado del proyecto
      if (nuevoEstado === 'Finalizado' || nuevoEstado === 'Cancelado') {
            let estadoTareaNuevo = (nuevoEstado === 'Finalizado') ? 'Finalizado' : 'Eliminada';

        await Tarea.updateMany(
          { proyectoId: idProyecto, estado: { $nin: ['Finalizado', 'Eliminada'] } },
          { $set: { estado: estadoTareaNuevo } }
        );
      }
     
      res.redirect('/proyectos');

    } catch (error) {
      console.error('Error al actualizar proyecto:', error);
      const empleados = await Empleado.find().lean();
      res.render('proyectos/editar', {
        error: true,
        proyecto: { ...req.body, _id: idProyecto },
        empleados,
        estadosValidos
      });
    }
  },

  // Eliminar un proyecto (baja lógica) 
  eliminar: async (req, res) => {
    try {
      const idProyecto = req.params.id; 

      // Marcar el proyecto como Cancelado
      await Proyecto.findByIdAndUpdate(idProyecto, { estado: 'Cancelado' });

      // Actualización de tareas acorde al estado del proyecto
      await Tarea.updateMany(
        { proyectoId: idProyecto, estado: { $nin: ['Finalizado', 'Eliminada'] } },
        { $set: { estado: 'Eliminada' } }
      );
  

      res.redirect('/proyectos');
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      res.status(500).redirect('/proyectos');
    }
  },

  // Quitar un empleado de un proyecto y de sus tareas 
  quitarEmpleado: async (req, res) => {
    const { idProyecto, idEmpleado } = req.params;
    try {
      const proyecto = await Proyecto.findById(idProyecto);
      if (!proyecto) return res.status(404).send('Proyecto no encontrado');

      // Quitar del proyecto
      proyecto.empleadosAsignados = proyecto.empleadosAsignados.filter(
        eId => eId.toString() !== idEmpleado
      );
      await proyecto.save();

      // Quitar de las tareas del proyecto
      await Tarea.updateMany(
        { proyectoId: idProyecto },
        { $pull: { empleadosAsignados: idEmpleado } }
      );

      res.redirect(`/proyectos/editar/${idProyecto}`);
    } catch (error) {
      console.error('Error al quitar empleado del proyecto:', error);
      res.status(500).send('Error al quitar empleado del proyecto');
    }
  }
};