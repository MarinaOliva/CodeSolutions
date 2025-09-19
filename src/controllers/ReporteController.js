const fs = require('fs').promises;

// Rutas de los archivos JSON
const archivoTareas = './data/tareas.json';
const archivoEmpleados = './data/empleados.json';
const archivoProyectos = './data/proyectos.json';
const archivoReportes = './data/reportes.json';

// Función para leer JSON de manera segura
async function leerJSON(archivo) {
    try {
        const datos = await fs.readFile(archivo, 'utf8');
        return JSON.parse(datos);
    } catch {
        await fs.writeFile(archivo, '[]');
        return [];
    }
}

// Función para guardar reportes
async function guardarReporte(reporte) {
    const reportes = await leerJSON(archivoReportes);
    reportes.push(reporte);
    await fs.writeFile(archivoReportes, JSON.stringify(reportes, null, 2));
}

// Controlador de reportes
module.exports = {
    // Genera y muestra reportes
    generar: async (req, res) => {
        try {
            const [tareas, empleados, proyectos] = await Promise.all([
                leerJSON(archivoTareas),
                leerJSON(archivoEmpleados),
                leerJSON(archivoProyectos)
            ]);

            // Total de horas registradas
            const totalHoras = tareas.reduce((sum, t) => sum + parseInt(t.horasRegistradas || 0), 0);

            // Reporte por empleado
            const tareasPorEmpleado = empleados.map(emp => {
                const tareasEmpleado = tareas.filter(t => t.empleadoId === emp.id);
                return {
                    nombre: emp.nombre,
                    cantidadTareas: tareasEmpleado.length,
                    horasRegistradas: tareasEmpleado.reduce((sum, t) => sum + parseInt(t.horasRegistradas || 0), 0),
                    tareas: tareasEmpleado
                };
            });

            // Crear un reporte completo
            const reporte = {
                fechaGeneracion: new Date().toISOString(),
                totalHoras,
                tareasPorEmpleado,
                proyectos
            };

            // Guardar en reportes.json
            await guardarReporte(reporte);

            // Renderizar la vista
            res.render('reportes/listar', { titulo: 'Reportes', reporte });
        } catch (error) {
            console.error(error);
            res.status(500).render('error', { titulo: 'Error', mensajeError: 'Error al generar reportes' });
        }
    }
};
