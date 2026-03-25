import { pool } from "../db/connection.js";

export const editarContratoHandler = async (event) => {
  // CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "PUT,OPTIONS"
      },
      body: ""
    };
  }

  try {
    const { id } = event.pathParameters;
    const body = JSON.parse(event.body);
    const {
      empresa,
      tipo_servicio,
      tarifa,
      moneda,
      fecha_inicio,
      fecha_fin,
      estado,
      descripcion,
      camion_ids
    } = body;

    // 1. Obtener contrato anterior
    const selectQuery = "SELECT * FROM contratos WHERE id = $1";
    const contratoAnterior = await pool.query(selectQuery, [id]);

    if (contratoAnterior.rows.length === 0) {
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

    const datosAnteriores = contratoAnterior.rows[0];

    // 2. UPDATE contratos
    const updateQuery = `
      UPDATE contratos
      SET empresa = $1, tipo_servicio = $2, tarifa = $3, 
          moneda = $4, fecha_inicio = $5, fecha_fin = $6, 
          estado = $7, descripcion = $8
      WHERE id = $9
      RETURNING *
    `;

    const updateResult = await pool.query(updateQuery, [
      empresa,
      tipo_servicio,
      tarifa,
      moneda,
      fecha_inicio,
      fecha_fin,
      estado,
      descripcion,
      id
    ]);

    const contratoActualizado = updateResult.rows[0];

    // 3. Si camion_ids viene: DELETE y luego INSERT
    if (camion_ids && Array.isArray(camion_ids)) {
      // Eliminar asignaciones anteriores
      const deleteQuery = "DELETE FROM contrato_camion WHERE contrato_id = $1";
      await pool.query(deleteQuery, [id]);

      // Insertar nuevas asignaciones
      if (camion_ids.length > 0) {
        for (const camion_id of camion_ids) {
          const insertQuery = `
            INSERT INTO contrato_camion (contrato_id, camion_id)
            VALUES ($1, $2)
          `;
          await pool.query(insertQuery, [id, camion_id]);
        }
      }
    }

    // 4. INSERT en historial_contratos
    const historialQuery = `
      INSERT INTO historial_contratos
      (contrato_id, accion, datos_anteriores, datos_nuevos)
      VALUES ($1, $2, $3, $4)
    `;

    await pool.query(historialQuery, [
      id,
      "MODIFICACION",
      JSON.stringify(datosAnteriores),
      JSON.stringify(contratoActualizado)
    ]);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify(contratoActualizado)
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
