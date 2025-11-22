module.exports = (req, res, next) => {
  const { password, confirmPassword } = req.body;

  // Ambas deben existir
  if (!password || !confirmPassword) {
    return res.status(400).render("error", {
      titulo: "Contraseña inválida",
      mensajeError: "Debe ingresar una contraseña y confirmarla."
    });
  }

  // Coincidencia
  if (password !== confirmPassword) {
    return res.status(400).render("error", {
      titulo: "Las contraseñas no coinciden",
      mensajeError: "Las contraseñas ingresadas no coinciden."
    });
  }

  // Reglas de seguridad
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!regex.test(password)) {
    return res.status(400).render("error", {
      titulo: "Contraseña insegura",
      mensajeError: "La contraseña debe tener al menos 8 caracteres, incluir mayúsculas, minúsculas, un número y un símbolo."
    });
  }

  next();
};
