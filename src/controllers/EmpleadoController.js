// Importar módulos necesarios
const Empleado = require('../models/Empleado');
const Proyecto = require('../models/Proyecto');
const Tarea = require('../models/Tarea');
const Usuario = require('../models/Usuario'); 

// Listado de roles y áreas válidas
const ROLES_VALIDOS = ['administrador', 'desarrollador', 'QA', 'DevOps', 'soporte', 'contador'];
const AREAS_VALIDAS = ['Desarrollo', 'Administración', 'Soporte', 'Contabilidad'];

// Permisos del sistema
const ACCESS_ROLES_VALIDOS = ['gerente_admin', 'desarrollador', 'soporte', 'contador', 'jefe_proyecto'];

// Controlador de empleados
module.exports = {

    // Listar todos los empleados
    listar: async (req, res) => {
        try {
            const empleados = await Empleado.find().lean(); 
            res.render('empleados/listar', { empleados });
        } catch (error) {
            console.error('Error en listar empleados:', error);
            res.status(500).render('error', { 
                titulo: 'Error',
                mensajeError: 'Error al obtener los empleados'
            });
        }
    },

    // Mostrar formulario para crear nuevo empleado
    mostrarFormulario: (req, res) => {
        res.render('empleados/crear');
    },

    // Crear un nuevo empleado
    crear: async (req, res) => {

        const { 
            nombre, 
            email, 
            especialidad, 
            area, 
            rol, 
            habilidades,
            access_role
        } = req.body;

        // Validación básica
        if (!ROLES_VALIDOS.includes(rol) || !AREAS_VALIDAS.includes(area)) {
            return res.render('empleados/crear', {
                error: true,
                mensaje: 'Rol o área inválida',
                datos: req.body
            });
        }

        if (!ACCESS_ROLES_VALIDOS.includes(access_role)) {
            return res.render('empleados/crear', {
                error: true,
                mensaje: 'Permiso del sistema inválido',
                datos: req.body
            });
        }

        try {

            const nuevoEmpleado = new Empleado({
                nombre,
                email,
                especialidad,
                area,
                rol,
                access_role,
                habilidades: habilidades ? habilidades.split(',').map(h => h.trim()) : []
            });

            await nuevoEmpleado.save();
            res.redirect('/empleados');

        } catch (error) {
            console.error('Error al crear empleado:', error);

            res.render('empleados/crear', {
                error: true,
                mensaje: 'Error al guardar el empleado (verifique que el email no esté duplicado)',
                datos: req.body
            });
        }
    },

    // Mostrar formulario de edición de empleado
    mostrarFormularioEditar: async (req, res) => {
        const empleadoId = req.params.id;

        try {
            const empleado = await Empleado.findById(empleadoId).lean();

            if (!empleado) {
                return res.status(404).render('error', {
                    titulo: 'Empleado no encontrado',
                    mensajeError: 'No existe un empleado con ese ID'
                });
            }

            res.render('empleados/editar', { empleado });

        } catch (error) {
            console.error(error);

            res.status(500).render('error', {
                titulo: 'Error',
                mensajeError: 'No se pudo cargar el formulario de edición'
            });
        }
    },

    // Editar un empleado existente
    editar: async (req, res) => {

        const empleadoId = req.params.id;

        const { 
            nombre, 
            email, 
            especialidad, 
            area, 
            rol, 
            habilidades,
            access_role
        } = req.body;

        if (!ROLES_VALIDOS.includes(rol) || !AREAS_VALIDAS.includes(area)) {
            return res.render('empleados/editar', {
                error: true,
                mensaje: 'Rol o área inválida',
                empleado: { _id: empleadoId, ...req.body }
            });
        }

        if (!ACCESS_ROLES_VALIDOS.includes(access_role)) {
            return res.render('empleados/editar', {
                error: true,
                mensaje: 'Permiso del sistema inválido',
                empleado: { _id: empleadoId, ...req.body }
            });
        }

        try {

            await Empleado.findByIdAndUpdate(
                empleadoId,
                {
                    nombre,
                    email,
                    especialidad,
                    area,
                    rol,
                    access_role,
                    habilidades: habilidades ? habilidades.split(',').map(h => h.trim()) : []
                },
                { new: true, runValidators: true }
            );

            res.redirect('/empleados');

        } catch (error) {
            console.error(error);
            res.status(500).render('error', {
                titulo: 'Error',
                mensajeError: 'No se pudo guardar la edición del empleado'
            });
        }
    },

    // Eliminar un empleado y su usuario asociado
    eliminar: async (req, res) => {

        const empleadoId = req.params.id;

        try {
            await Usuario.deleteOne({ empleado_id: empleadoId });

            await Empleado.findByIdAndDelete(empleadoId);
            
            await Proyecto.updateMany(
                { empleadosAsignados: empleadoId },
                { $pull: { empleadosAsignados: empleadoId } }
            );

            await Tarea.updateMany(
                { empleadosAsignados: empleadoId },
                { $pull: { empleadosAsignados: empleadoId } }
            );

            const empleados = await Empleado.find().lean();
            res.render('empleados/listar', { 
                empleados, 
                mensaje: 'Empleado y usuario eliminados correctamente.' 
            });

        } catch (error) {
            console.error(error);

            res.status(500).render('error', { 
                titulo: 'Error', 
                mensajeError: 'No se pudo eliminar el empleado' 
            });
        }
    },

    // Quitar un empleado solo de un proyecto
    quitarDeProyecto: async (req, res) => {

        const { empleadoId, proyectoId } = req.params;

        try {
            await Proyecto.findByIdAndUpdate(
                proyectoId,
                { $pull: { empleadosAsignados: empleadoId } }
            );

            await Tarea.updateMany(
                { proyectoId, empleadosAsignados: empleadoId },
                { $pull: { empleadosAsignados: empleadoId } }
            );

            res.redirect(`/proyectos/editar/${proyectoId}`);

        } catch (error) {
            console.error(error);

            res.status(500).render('error', { 
                titulo: 'Error', 
                mensajeError: 'No se pudo quitar al empleado del proyecto' 
            });
        }
    }
};
