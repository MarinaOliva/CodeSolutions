const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  tipo: { type: String, enum: ['Error', 'Consulta', 'Solicitud de mejora'], default: 'Consulta' },
  estado: { type: String, enum: ['En progreso', 'Derivado', 'Solucionado'], default: 'En progreso' },
  responsableActual: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  fechaCreacion: { type: Date, default: Date.now },
  fechaCierre: { type: Date },
  proyectoRelacionado: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' },
  cliente: { type: String, trim: true },
});

module.exports = mongoose.model('Ticket', ticketSchema);
