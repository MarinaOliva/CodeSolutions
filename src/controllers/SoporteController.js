const Ticket = require('../models/Ticket');
const Usuario = require('../models/Usuario');
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');

module.exports = {

   // LISTAR TICKETS
   listar: async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate({
          path: 'responsableActual',
          populate: { path: 'empleado_id' }
        })
        .populate('proyectoRelacionado');

      const notificacion = req.query.notificacion || null;

      res.render('soporte/listar', { tickets, notificacion });

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al listar tickets');
    }
  },

   // FORM CREAR
   crearForm: async (req, res) => {
    try {
      const usuariosResponsables = await Usuario.find({
        access_role: { $in: ['soporte', 'jefe_proyecto', 'gerente_admin'] }
      }).populate('empleado_id');

      const proyectos = await Proyecto.find();

      res.render('soporte/crear', { usuariosResponsables, proyectos });

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar formulario de ticket');
    }
  },

   // CREAR
   crear: async (req, res) => {
    try {
      const ticket = new Ticket({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        tipo: req.body.tipo,
        estado: req.body.estado,
        responsableActual: req.body.responsableActual || null,
        proyectoRelacionado: req.body.proyectoRelacionado || null,
        cliente: req.body.cliente || ''
      });

      await ticket.save();
      res.redirect('/soporte');

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear ticket');
    }
  },

   // FORM EDITAR
   editarForm: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id)
        .populate({
          path: 'responsableActual',
          populate: { path: 'empleado_id' }
        })
        .populate('proyectoRelacionado');

      const usuariosResponsables = await Usuario.find({
        access_role: { $in: ['soporte', 'jefe_proyecto', 'gerente_admin'] }
      }).populate('empleado_id');

      const proyectos = await Proyecto.find();

      res.render('soporte/editar', { ticket, usuariosResponsables, proyectos });

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al cargar formulario de edición');
    }
  },

   // ACTUALIZAR (CON LÓGICA DE DERIVACIÓN AUTOMÁTICA)
   actualizar: async (req, res) => {
    try {
      const { titulo, descripcion, tipo, estado, responsableActual, proyectoRelacionado, cliente } = req.body;

      const ticket = await Ticket.findById(req.params.id);
      if (!ticket) return res.status(404).send('Ticket no encontrado');

      ticket.titulo = titulo;
      ticket.descripcion = descripcion;
      ticket.tipo = tipo;
      ticket.estado = estado;
      ticket.cliente = cliente || '';
      
      if (estado === 'Solucionado' && !ticket.fechaCierre) {
        ticket.fechaCierre = new Date();
      }

      // derivación si el responsable no es soporte
      let mensajeNotificacion = null;

      if (responsableActual && proyectoRelacionado) {
        
        const nuevoResponsable = await Usuario.findById(responsableActual).populate('empleado_id');

        if (nuevoResponsable) {
          ticket.responsableActual = nuevoResponsable._id;
          ticket.proyectoRelacionado = proyectoRelacionado;

          if (nuevoResponsable.access_role !== 'soporte') {
            
            const tareaExistente = await Tarea.findOne({ ticketOrigen: ticket._id });

            if (!tareaExistente) {
            
              const nuevaTarea = new Tarea({
                proyectoId: proyectoRelacionado,
                nombre: `[Ticket] ${titulo}`, 
                empleadosAsignados: nuevoResponsable.empleado_id ? [nuevoResponsable.empleado_id._id] : [],
                estado: 'Pendiente',
                ticketOrigen: ticket._id  
              });

              await nuevaTarea.save();

              // pop up notificacion enviada
              const nombreEmp = nuevoResponsable.empleado_id ? nuevoResponsable.empleado_id.nombre : 'Usuario';
              mensajeNotificacion = `Se notificó vía mail a ${nombreEmp} (${nuevoResponsable.access_role}) y se generó una Tarea automáticamente.`;
              
              ticket.estado = 'Derivado';
            }
          }
        }
      } else {
        // Si borraron el responsable o proyecto
        ticket.responsableActual = responsableActual || null;
        ticket.proyectoRelacionado = proyectoRelacionado || null;
      }

      await ticket.save();

      if (mensajeNotificacion) {
        res.redirect(`/soporte?notificacion=${encodeURIComponent(mensajeNotificacion)}`);
      } else {
        res.redirect('/soporte');
      }

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar ticket');
    }
  },

   // BORRAR
   borrar: async (req, res) => {
    try {
      await Ticket.findByIdAndDelete(req.params.id);
      res.redirect('/soporte');

    } catch (error) {
      console.error(error);
      res.status(500).send('Error al borrar ticket');
    }
  }
};
