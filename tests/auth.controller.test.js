process.env.JWT_SECRET = "test_secret_key";

jest.mock("jsonwebtoken"); 
const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const { authController } = require("../src/controllers/AuthController");
const Usuario = require("../src/models/Usuario");
const Empleado = require("../src/models/Empleado");

jest.setTimeout(20000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri, { dbName: "jest" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Usuario.deleteMany({});
  await Empleado.deleteMany({});
  jest.clearAllMocks();
});

describe("AuthController - Registrar", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
    };
  });

  test("Debe fallar si faltan datos", async () => {
    await authController.registrar(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalled();
  });

  test("Debe fallar si email no es un empleado autorizado", async () => {
    req.body = { email: "test@test.com", password: "Contraseña!123456" };
    await authController.registrar(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("Debe registrar un usuario nuevo correctamente", async () => {
    await Empleado.create({
      email: "emp@test.com",
      rol: "desarrollador",
      area: "Desarrollo",
      nombre: "Empleado Test",
      access_role: "desarrollador",
    });

    req.body = { email: "emp@test.com", password: "Contraseña!123456" };
    
    await authController.registrar(req, res);

    const usuario = await Usuario.findOne({ email: "emp@test.com" });
    expect(usuario).not.toBeNull();
  });
});

describe("AuthController - Login", () => {
  let req, res;

  beforeEach(async () => {
    // 1. Crear Empleado
    const empleado = await Empleado.create({
      email: "emp@test.com",
      rol: "desarrollador",
      area: "Desarrollo",
      nombre: "Empleado Test",
      access_role: "desarrollador",
    });

    // 2. Crear Usuario 
    await Usuario.create({
      email: "emp@test.com",
      password_hash: "Contraseña!123456", 
      empleado_id: empleado._id,
      access_role: empleado.access_role,
      estaActivo: true,
    });

    req = { body: {} };
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      redirect: jest.fn(),
    };
  });

  test("Debe fallar si usuario no existe (email incorrecto)", async () => {
    req.body = { email: "x@test.com", password: "123" };
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("Debe fallar si contraseña es incorrecta", async () => {
    req.body = { email: "emp@test.com", password: "wrong" };
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("Debe iniciar sesión correctamente", async () => {
    req.body = { email: "emp@test.com", password: "Contraseña!123456" };
    
    jwt.sign.mockReturnValue("fake-token");

    await authController.login(req, res);

    expect(jwt.sign).toHaveBeenCalled();
    expect(res.cookie).toHaveBeenCalledWith("token", "fake-token", expect.any(Object));
    expect(res.redirect).toHaveBeenCalledWith("/");
  });
});