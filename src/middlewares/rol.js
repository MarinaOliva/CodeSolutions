const roleMiddleware = (rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).redirect("/auth/login");
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).render("403", { error: "No tienes permisos para acceder a esta página" });
    }

    next();
  };
};

module.exports = roleMiddleware;
