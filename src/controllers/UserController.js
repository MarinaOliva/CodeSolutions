const bcrypt = require("bcryptjs");
const User = require("../models/Usuario");

exports.changePassword = async (req, res) => {
  try {
    const { actual, password } = req.body; 
    const userId = req.usuario.id;

    const usuario = await User.findById(userId);
    if (!usuario) {
      return res.status(404).render("error", {
        titulo: "Usuario no encontrado",
        mensajeError: "No se pudo cargar el usuario."
      });
    }

    // Validar contraseña actual
    const esCorrecta = await bcrypt.compare(actual, usuario.password_hash);
    if (!esCorrecta) {
      return res.status(400).render("auth/profile", {
        usuario: req.usuario,
        error: "La contraseña actual es incorrecta."
      });
    }

    // Guardar nueva contraseña (ya validada por el middleware)
    usuario.password_hash = password;
    await usuario.save();

    return res.render("auth/profile", {
      usuario: req.usuario,
      exito: "Contraseña actualizada correctamente."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).render("error", {
      titulo: "Error al cambiar contraseña",
      mensajeError: "Ocurrió un problema. Intente más tarde."
    });
  }
};
