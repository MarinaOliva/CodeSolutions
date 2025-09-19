// Importar módulos necesarios
const fs = require('fs').promises;
const Empleado = require('../models/Empleado'); 

// Ruta del archivo JSON donde se almacenan los empleados
const archivoEmpleados = './data/empleados.json';

// Listado de roles y áreas válidas para validaciones
const ROLES_VALIDOS = ['administrador', 'desarrollador', 'QA', 'DevOps', 'soporte', 'contador'];
const AREAS_VALIDAS = ['Desarrollo', 'Administración', 'Soporte', 'Contabilidad'];

// Obtener empleados desde el archivo JSON (se crea un nuevo archivo vacío si no existe)
const obtenerEmpleados = async () => {
    try {
        const datos = await fs.readFile(archivoEmpleados, 'utf8');
        return JSON.parse(datos);
    } catch (error) {
        // Si ocurre un error (ej. archivo no existe), se crea uno nuevo
        await fs.writeFile(archivoEmpleados, '[]');
        return [];
    }
};

// Exportar los métodos del controlador
module.exports = {

    // Listar todos los empleados
    listar: async (req, res) => {
        try {
            const empleados = await obtenerEmpleados();
            res.render('empleados/listar', { empleados });
        } catch (error) {
            res.status(500).send('Error al obtener los empleados');
        }
    },

    // Mostrar el formulario para crear un nuevo empleado
    mostrarFormulario: (req, res) => {
        res.render('empleados/crear');
    },

    // Crear un nuevo empleado
    
    crear: async (req, res) => {
        const { nombre, email, especialidad, area, rol, habilidades } = req.body;

        // Validar que el rol y el área sean válidos
        if (!ROLES_VALIDOS.includes(rol) || !AREAS_VALIDAS.includes(area)) {
            return res.render('empleados/crear', {
                error: true,
                mensaje: 'Rol o área inválida',
                datos: req.body
            });
        }

        try {
            // Obtener empleados existentes
            const empleados = await obtenerEmpleados();

            // Crear nuevo empleado con el constructor actualizado
            const nuevoEmpleado = new Empleado(
                nombre,
                email,
                especialidad,
                area,
                rol,
                habilidades || [] // si no hay habilidades, se inicializa como array vacío
            );

            // Agregar el nuevo empleado al listado
            empleados.push(nuevoEmpleado);

            // Guardar la lista completa en el archivo JSON
            await fs.writeFile(archivoEmpleados, JSON.stringify(empleados, null, 2));

            // Redirigir a la vista de listado de empleados
            res.redirect('/empleados');
        } catch (error) {
            // Manejo de errores al guardar
            res.render('empleados/crear', {
                error: true,
                mensaje: 'Error al guardar el empleado',
                datos: req.body
            });
        }
    }
};
