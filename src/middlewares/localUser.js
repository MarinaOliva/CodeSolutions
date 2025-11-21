const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const localUser = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.locals.usuario = decoded; // disponible en todas las vistas
    } catch (err) {
      console.error("Token inválido en localUser:", err.message);
      res.locals.usuario = null;
    }
  } else {
    res.locals.usuario = null;
  }

  next();
};

module.exports = localUser;
