const { v4: uuidv4 } = require('uuid');

const estadosValidos = ['Pendiente', 'En progreso', 'Finalizado', 'Eliminada'];

class Tarea {
  constructor(proyectoId, nombre, horasRegistradas = 0, empleadoId = null, estado = "Pendiente") {
    this.id = uuidv4();
    this.proyectoId = proyectoId;      
    this.nombre = nombre?.trim();      // título o nombre de la tarea
    this.horasRegistradas = horasRegistradas; 
    this.empleadoId = empleadoId;      

    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado inválido: ${estado}. Estados permitidos: ${estadosValidos.join(", ")}`);
    }
    this.estado = estado;

    this.fechaCreacion = new Date().toISOString();
  }

  // Registrar más horas
  agregarHoras(horas) {
    if (horas <= 0) {
      throw new Error("Las horas deben ser mayores a 0");
    }
    this.horasRegistradas += horas;
  }

  // Cambiar estado
  actualizarEstado(nuevoEstado) {
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}. Estados permitidos: ${estadosValidos.join(", ")}`);
    }
    this.estado = nuevoEstado;
  }

  // Asignar o reasignar empleado
  asignarEmpleado(nuevoEmpleadoId) {
    this.empleadoId = nuevoEmpleadoId;
  }
}

module.exports = Tarea;
