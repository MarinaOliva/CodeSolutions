process.env.JWT_SECRET = "test_secret_key";
process.env.NODE_ENV = "test";

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const express = require("express");
const cookieParser = require("cookie-parser");

const authRoutes = require("../src/routes/authRoutes");
const Usuario = require("../src/models/Usuario");
const Empleado = require("../src/models/Empleado");

jest.setTimeout(20000);

let app;
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);

  app = express();
  
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());

  // --- MOCK DEL VIEW ENGINE ---
  app.use((req, res, next) => {
    res.render = (view, data) => {
        res.send({ view, data }); 
    };
    next();
  });

  app.use("/auth", authRoutes);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Usuario.deleteMany({});
  await Empleado.deleteMany({});
});

describe("Rutas de autenticación", () => {
  test("GET /auth/login debe cargar vista", async () => {
    const res = await request(app).get("/auth/login");
    expect(res.status).toBe(200);
  });

  test("GET /auth/registro debe cargar vista", async () => {
    const res = await request(app).get("/auth/registro");
    expect(res.status).toBe(200);
  });

  test("POST /auth/registro crea usuario nuevo correctamente", async () => {
    // 1. Crear empleado previo
    await Empleado.create({
      email: "emp@test.com",
      nombre: "Empleado Test",
      rol: "desarrollador",
      area: "Desarrollo",
      access_role: "desarrollador"
    });

    // 2. Hacer petición
    const res = await request(app)
      .post("/auth/registro")
      .send({ 
        email: "emp@test.com", 
        password: "Password123!",
        confirmPassword: "Password123!" 
      });

    expect([200, 302]).toContain(res.status);

    // Verificar DB
    const usuario = await Usuario.findOne({ email: "emp@test.com" });
    expect(usuario).not.toBeNull();
  });
});