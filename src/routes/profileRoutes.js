const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { changePassword } = require("../controllers/UserController");

const router = express.Router();

// Ver perfil
router.get("/profile", authMiddleware, (req, res) => {
  res.render("auth/profile", { usuario: req.usuario });
});

// Cambiar contraseña
router.put("/profile/change-password", authMiddleware, changePassword);

module.exports = router;
