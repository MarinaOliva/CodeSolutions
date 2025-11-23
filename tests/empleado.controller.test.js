const empleadoController = require("../src/controllers/EmpleadoController");
const Empleado = require("../src/models/Empleado");
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');


let mongoServer;


beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});


const crearEmpleadoValido = () => Empleado.create({
  nombre: "Juan Perez",
  rol: "desarrollador",
  area: "Desarrollo",
  email: "emp@test.com",
  password: "Password123!" 
});

beforeEach(async () => {
  await Empleado.deleteMany({});
});

describe("EmpleadoController - eliminar", () => {
  let req, res;

  beforeEach(async () => {
    req = { params: {} };
    res = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
    };
  });

  test("Debe eliminar un empleado existente", async () => {
    const empleado = await crearEmpleadoValido();
    req.params.id = empleado._id;

    await empleadoController.eliminar(req, res);

    
    const existe = await Empleado.findById(empleado._id);
    expect(existe).toBeNull();
    expect(res.render).toHaveBeenCalledWith(
        'empleados/listar', 
        expect.objectContaining({
            mensaje: 'Empleado y usuario eliminados correctamente.'
        })
    );
});
});