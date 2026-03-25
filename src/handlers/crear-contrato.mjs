import { pool } from "../db/connection.js";

export const crearContratoHandler = async (event) => {
  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS"
      },
      body: ""
    };
  }

  try {
    const body = JSON.parse(event.body);
    const {
      codigo,
      empresa,
      tipo_servicio,
      tarifa,
      moneda,
      fecha_inicio,
      fecha_fin,
      descripcion,
      camion_ids
    } = body;

    // Validación de tipo_servicio
    const tiposValidos = ["por_viaje", "por_hora", "por_tonelada"];
    if (!tiposValidos.includes(tipo_servicio)) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({
          error: "Tipo de servicio inválido. Use: por_viaje, por_hora, por_tonelada"
        })
      };
    }

    // 1. INSERT en contratos
    const insertContratoQuery = `
      INSERT INTO contratos
      (codigo, empresa, tipo_servicio, tarifa, moneda, fecha_inicio, fecha_fin, descripcion)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const contratoResult = await pool.query(insertContratoQuery, [
      codigo,
      empresa,
      tipo_servicio,
      tarifa,
      moneda,
      fecha_inicio,
      fecha_fin,
      descripcion
    ]);

    const contratoCreado = contratoResult.rows[0];

    // 2. INSERT en contrato_camion si vienen camion_ids
    if (camion_ids && Array.isArray(camion_ids) && camion_ids.length > 0) {
      for (const camion_id of camion_ids) {
        const insertCamionQuery = `
          INSERT INTO contrato_camion (contrato_id, camion_id)
          VALUES ($1, $2)
        `;
        await pool.query(insertCamionQuery, [contratoCreado.id, camion_id]);
      }
    }

    // 3. INSERT en historial_contratos
    const insertHistorialQuery = `
      INSERT INTO historial_contratos
      (contrato_id, accion, datos_nuevos)
      VALUES ($1, $2, $3)
    `;

    await pool.query(insertHistorialQuery, [
      contratoCreado.id,
      "CREACION",
      JSON.stringify(contratoCreado)
    ]);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(contratoCreado)
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
