// controllers/AuthController.js

const Usuario = require("../models/Usuario");
const Empleado = require("../models/Empleado");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authController = {

  // REGISTRO
  registrar: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).render("auth/register", { error: "Faltan datos requeridos" });
      }

      // Verificar que el empleado existe
      const empleado = await Empleado.findOne({ email });
      if (!empleado) {
        return res.status(403).render("auth/register", { error: "Su email no está autorizado. Contacte al administrador." });
      }

      // Verificar que no exista ya un usuario
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).render("auth/register", { error: "Ya se ha registrado previamente" });
      }

      // Crear usuario (hash se hace en el modelo)
      const nuevoUsuario = new Usuario({
        email,
        password_hash: password,     
        empleado_id: empleado._id,
        access_role: empleado.access_role
      });

      await nuevoUsuario.save();

      res.render("auth/login", { mensaje: "Usuario creado con éxito. Ya puede iniciar sesión." });

    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).render("auth/register", { error: "Error interno del servidor" });
    }
  },

  // LOGIN
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const usuario = await Usuario.findOne({ email }).populate("empleado_id");
      if (!usuario || !usuario.estaActivo) {
        return res.status(401).render("auth/login", { error: "Email inválido" });
      }

      const passwordValido = await usuario.compararPassword(password);
      if (!passwordValido) {
        return res.status(401).render("auth/login", { error: "Contraseña inválida" });
      }

      // Generar token JWT
      const token = jwt.sign(
        {
          id: usuario._id,
          nombre: usuario.empleado_id.nombre,
          email: usuario.email,
          rol: usuario.access_role,
          empleadoId: usuario.empleado_id._id
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      // Enviar token en cookie segura
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });

      res.redirect("/");

    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).render("auth/login", { error: "Error interno del servidor" });
    }
  },

  // LOGOUT
  logout: (req, res) => {
    res.clearCookie("token");
    res.redirect("/auth/login");
  },

  // VALIDAR TOKEN
  verificarToken: (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/auth/login");

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.usuario = decoded;
      next();
    } catch (error) {
      console.error("Token inválido:", error);
      res.clearCookie("token");
      return res.redirect("/auth/login");
    }
  },
};

module.exports = { authController };
