import { pool } from "../db/connection.js";

export const eliminarContratoHandler = async (event) => {
  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "DELETE,OPTIONS"
      },
      body: ""
    };
  }

  try {
    const { id } = event.pathParameters;

    // 1. Obtener contrato antes de eliminar
    const selectQuery = "SELECT * FROM contratos WHERE id = $1";
    const contratoResult = await pool.query(selectQuery, [id]);

    if (contratoResult.rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "Contrato no encontrado"
        })
      };
    }

    const contratoEliminado = contratoResult.rows[0];

    // 2. INSERT en historial_contratos
    const historialQuery = `
      INSERT INTO historial_contratos
      (contrato_id, accion, datos_anteriores)
      VALUES ($1, $2, $3)
    `;

    await pool.query(historialQuery, [
      id,
      "ELIMINACION",
      JSON.stringify(contratoEliminado)
    ]);

    // 3. DELETE FROM contratos (contrato_camion se borra por CASCADE)
    const deleteQuery = "DELETE FROM contratos WHERE id = $1";
    await pool.query(deleteQuery, [id]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        message: "Contrato eliminado correctamente"
      })
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
