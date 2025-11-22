const roleMiddleware = (...rolesPermitidos) => {
  
  return (req, res, next) => {
    const usuario = res.locals.usuario;
  
    if (!usuario) {
      return res.status(401).redirect("/auth/login");
    }

    const rolUsuario = usuario.rol;

    if (!rolesPermitidos.includes(rolUsuario)) {
      console.log(
        `Acceso denegado. Rol actual: ${rolUsuario}. Requiere uno de: ${rolesPermitidos.join(", ")}`
      );
      return res.redirect("/"); 
    }

    next();
  };
};

module.exports = roleMiddleware;
