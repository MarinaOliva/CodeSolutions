const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded; // { id, nombre, email, rol }
    next();
  } catch (err) {
    console.error("Token inválido:", err);
    res.clearCookie("token");
    return res.status(401).redirect("/auth/login");
  }
};

module.exports = authMiddleware;
