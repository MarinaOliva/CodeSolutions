const validarPassword = require("../src/middlewares/validarPassword");

describe("Middleware validarPassword", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      render: jest.fn(),
    };
    next = jest.fn();
  });

  test("Debe devolver error si falta password", () => {
    req.body = { password: "", confirmPassword: "" };

    validarPassword(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalledWith("error", expect.any(Object));
  });

  test("Debe devolver error si las contraseñas no coinciden", () => {
    req.body = { password: "Pass123!", confirmPassword: "Otra123!" };

    validarPassword(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalled();
  });

  test("Debe devolver error si contraseña es insegura", () => {
    req.body = { password: "abc123", confirmPassword: "abc123" };

    validarPassword(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.render).toHaveBeenCalled();
  });

  test("Debe permitir continuar si es válida", () => {
    req.body = { password: "Seguro123!", confirmPassword: "Seguro123!" };

    validarPassword(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
