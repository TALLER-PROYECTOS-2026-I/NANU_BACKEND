import { jest } from "@jest/globals";

jest.unstable_mockModule("../../../src/db/connection.js", () => ({
  pool: {
    query: jest.fn(),
  },
}));

const { getCamiones } = await import("../../../src/handlers/get-camiones.mjs");
const { pool } = await import("../../../src/db/connection.js");

describe("Test para getCamiones", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Debe retornar status 200 y la lista de camiones cuando hay datos", async () => {
    const mockDbResponse = {
      rows: [
        { id: 1, placa: "ABC-123", modelo: "Volvo" },
        { id: 2, placa: "XYZ-987", modelo: "Scania" },
      ],
    };

    pool.query.mockResolvedValueOnce(mockDbResponse);

    const event = {};
    const result = await getCamiones(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(200);
    expect(body.message).toBe("Camiones obtenidos exitosamente");
    expect(body.data.length).toBe(2);
  });

  // Si no hay camiones registrados
  it("Debe retornar status 200 y un mensaje indicando que no hay camiones", async () => {
    // Simulamos que la base de datos responde con un arreglo vacío
    const mockDbResponse = { rows: [] };

    pool.query.mockResolvedValueOnce(mockDbResponse);

    const event = {};
    const result = await getCamiones(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(200);
    expect(body.message).toBe("No existen camiones registrados");
    expect(body.data.length).toBe(0);
  });

  it("Debe retornar status 500 cuando la base de datos falla (Ej. DB caída)", async () => {
    pool.query.mockRejectedValueOnce(new Error("Conexión fallida"));

    const event = {};
    const result = await getCamiones(event);
    const body = JSON.parse(result.body);

    expect(result.statusCode).toEqual(500);
    expect(body.message).toBe("Error interno obteniendo camiones");
  });
});
