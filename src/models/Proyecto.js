// Importar herramienta para generar IDs únicos
const { v4: uuidv4 } = require('uuid');

// Lista de estados válidos para un proyecto
const estadosValidos = ["activo", "en progreso", "finalizado", "pausado", "cancelado"];

class Proyecto {
  constructor(nombre, descripcion, cliente, estado = "activo") {
    this.id = uuidv4();

    // Normalizamos strings
    this.nombre = nombre?.trim();
    this.descripcion = descripcion?.trim();
    this.cliente = cliente?.trim();

    // Validación de estado
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado inválido: ${estado}. Estados permitidos: ${estadosValidos.join(", ")}`);
    }
    this.estado = estado;

    this.fechaCreacion = new Date().toISOString();

    // Nuevo campo: lista de empleados asignados
    this.empleadosAsignados = [];
  }

  // Métodos útiles para cambiar estado
  actualizarEstado(nuevoEstado) {
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}. Estados permitidos: ${estadosValidos.join(", ")}`);
    }
    this.estado = nuevoEstado;
  }

  finalizar() {
    this.estado = "finalizado";
  }

  pausar() {
    this.estado = "pausado";
  }

  // Métodos para manejar empleados asignados
  asignarEmpleado(idEmpleado) {
    if (!this.empleadosAsignados.includes(idEmpleado)) {
      this.empleadosAsignados.push(idEmpleado);
    }
  }

  quitarEmpleado(idEmpleado) {
    this.empleadosAsignados = this.empleadosAsignados.filter(id => id !== idEmpleado);
  }
}

module.exports = Proyecto;
