import { pool } from "../db/connection.js";

export const getContratosHandler = async (event) => {
  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS"
      },
      body: ""
    };
  }

  try {
    const query = `
      SELECT c.*, 
             ARRAY_AGG(cam.placa) AS camiones
      FROM contratos c
      LEFT JOIN contrato_camion cc ON cc.contrato_id = c.id
      LEFT JOIN camiones cam ON cam.id = cc.camion_id
      GROUP BY c.id
      ORDER BY c.fecha_inicio DESC
    `;

    const result = await pool.query(query);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(result.rows)
    };

  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
