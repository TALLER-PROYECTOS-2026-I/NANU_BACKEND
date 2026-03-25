import { pool } from "../db/connection.js";

export const postLoginHandler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "POST,OPTIONS",
      },
      body: "",
    };
  }

  try {
    // 1. Obtener datos del body
    const body = JSON.parse(event.body);
    const { email, password } = body;

    // 2. Validar que vengan los campos
    if (!email || !password) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          message: "Email y password son requeridos",
        }),
      };
    }

    // 3. Buscar usuario por email
    const result = await pool.query(
      "SELECT id, nombre, email, password, rol, estado FROM usuarios WHERE email = $1",
      [email],
    );

    // 4. Validar si existe el usuario
    if (result.rows.length === 0) {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          message: "Credenciales invalidas",
        }),
      };
    }

    const usuario = result.rows[0];

    // 5. Validar estado del usuario
    if (usuario.estado !== "activo") {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          message: "Usuario inactivo",
        }),
      };
    }

    // 6. Comparar password
    if (usuario.password !== password) {
      return {
        statusCode: 401,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          message: "Credenciales invalidas",
        }),
      };
    }

    // 7. Login exitoso - devolver datos del usuario (sin password)
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Login exitoso",
        data: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        },
      }),
    };
  } catch (error) {
    console.error("Error en login:", error);

    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        message: "Error interno del servidor",
        error: error.message,
      }),
    };
  }
};
