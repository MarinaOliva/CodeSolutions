const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  empleado_id: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado", required: true },
  access_role: {
    type: String,
    enum: ["gerente_admin", "jefe_proyecto", "desarrollador", "soporte", "contador"],
    required: true
  },
  estaActivo: { type: Boolean, default: true },
}, { timestamps: { createdAt: "fechaCreacion", updatedAt: "fechaActualizacion" } });

// Hash password antes de guardar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password_hash")) return next();
  this.password_hash = await bcrypt.hash(this.password_hash, 10);
  next();
});

// comparar password
usuarioSchema.methods.compararPassword = function (password) {
  return bcrypt.compare(password, this.password_hash);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
