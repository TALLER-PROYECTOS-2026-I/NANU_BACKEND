import { pool } from "../db/connection.js";

export const getCamiones = async (event) => {
  try {
    const result = await pool.query("SELECT * FROM camiones");

    // Validamos si la base de datos no tiene registros
    if (result.rows.length === 0) {
      return {
        statusCode: 200, // Sigue siendo 200 porque la consulta fue exitosa, solo que no hay datos
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "No existen camiones registrados",
          data: [],
        }),
      };
    }

    // Escenario normal: Sí hay camiones
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Camiones obtenidos exitosamente",
        data: result.rows,
      }),
    };
  } catch (error) {
    console.error("Error al obtener camiones:", error);

    // Escenario de fallo crítico (ej. DB apagada)
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error interno obteniendo camiones",
        error: error.message,
      }),
    };
  }
};
