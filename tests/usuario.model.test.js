const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Usuario = require("../src/models/Usuario");
const bcrypt = require("bcryptjs");

jest.setTimeout(20000);

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.disconnect();
  await mongoose.connect(mongo.getUri(), { dbName: "jest" });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

beforeEach(async () => {
  await Usuario.deleteMany({});
});

describe("Usuario Model", () => {
  it("debe hashear la contraseña antes de guardar", async () => {
    const usuario = new Usuario({
      email: "test@example.com",
      password_hash: "123456",
      empleado_id: new mongoose.Types.ObjectId(),
      access_role: "desarrollador"
    });

    await usuario.save();

    expect(usuario.password_hash).not.toBe("123456");
    expect(await bcrypt.compare("123456", usuario.password_hash)).toBe(true);
  });

  it("debe comparar la contraseña correctamente", async () => {
    const usuario = new Usuario({
      email: "admin@test.com",
      password_hash: "admin123",
      empleado_id: new mongoose.Types.ObjectId(),
      access_role: "soporte"
    });

    await usuario.save();

    const esValida = await usuario.compararPassword("admin123");
    const noValida = await usuario.compararPassword("incorrecta");

    expect(esValida).toBe(true);
    expect(noValida).toBe(false);
  });

  it("debe requerir email único", async () => {
    const datos = {
      email: "duplicado@test.com",
      password_hash: "asd123",
      empleado_id: new mongoose.Types.ObjectId(),
      access_role: "contador"
    };

    await new Usuario(datos).save();

    await expect(new Usuario(datos).save())
      .rejects
      .toThrow(/duplicate key/i);
  });
});
