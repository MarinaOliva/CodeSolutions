// routes/authRoutes.js

const express = require("express");
const { authController } = require("../controllers/AuthController");

const authMiddleware = require("../middlewares/auth");
const localUser = require("../middlewares/localUser");

const validarPassword = require("../middlewares/validarPassword");

const router = express.Router();

// RUTAS PÚBLICAS
router.get("/login", (req, res) => res.render("auth/login"));
router.post("/login", authController.login);

router.get("/registro", (req, res) => res.render("auth/register"));

router.post("/registro", validarPassword, authController.registrar);

// RUTAS PRIVADAS 
router.use(authMiddleware, localUser);

// Perfil del usuario
router.get("/profile", (req, res) => {
  res.render("auth/profile", { usuario: req.usuario });
});

// Logout
router.get("/logout", authController.logout);

module.exports = router;
