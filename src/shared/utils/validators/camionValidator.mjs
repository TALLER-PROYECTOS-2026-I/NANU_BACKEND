import { ERROR_MESSAGES } from "../../constants/errorMessages.mjs";

export class CamionValidator {
  static validateId(id) {
    if (!id) {
      throw new Error(ERROR_MESSAGES.CAMION_ID_REQUIRED);
    }
    if (typeof id !== "string") {
      throw new Error("El ID debe ser un texto");
    }
    if (id.trim() === "") {
      throw new Error("El ID no puede estar vacío");
    }
    return id.trim();
  }

  static validatePlaca(placa) {
    if (!placa) {
      throw new Error(ERROR_MESSAGES.CAMION_PLACA_REQUIRED);
    }
    if (typeof placa !== "string") {
      throw new Error("La placa debe ser un texto");
    }
    if (placa.trim() === "") {
      throw new Error("La placa no puede estar vacía");
    }
    // Validar formato de placa (ejemplo: ABC-123)
    const placaRegex = /^[A-Z]{3}-\d{3}$/;
    if (!placaRegex.test(placa.trim())) {
      throw new Error(ERROR_MESSAGES.CAMION_PLACA_FORMAT);
    }
    return placa.trim().toUpperCase();
  }

  static validateModelo(modelo) {
    if (!modelo) {
      throw new Error(ERROR_MESSAGES.CAMION_MODELO_REQUIRED);
    }
    if (typeof modelo !== "string") {
      throw new Error("El modelo debe ser un texto");
    }
    if (modelo.trim() === "") {
      throw new Error("El modelo no puede estar vacío");
    }
    return modelo.trim();
  }

  static validateCapacidad(capacidad) {
    if (capacidad === undefined || capacidad === null) {
      throw new Error(ERROR_MESSAGES.CAMION_CAPACIDAD_REQUIRED);
    }
    if (typeof capacidad !== "number") {
      throw new Error(ERROR_MESSAGES.CAMION_CAPACIDAD_INVALID);
    }
    if (capacidad <= 0) {
      throw new Error("La capacidad debe ser mayor a 0");
    }
    return capacidad;
  }

  static validateYear(year) {
    if (!year) {
      return null; // Year is optional
    }
    if (typeof year !== "number") {
      throw new Error("El año debe ser un número");
    }
    const currentYear = new Date().getFullYear();
    if (year < 2000 || year > currentYear + 1) {
      throw new Error(ERROR_MESSAGES.CAMION_YEAR_INVALID);
    }
    return year;
  }

  static validateEstado(estado) {
    if (!estado) {
      return "ACTIVO";
    }
    const estadosValidos = ["ACTIVO", "INACTIVO", "MANTENIMIENTO"];
    if (!estadosValidos.includes(estado)) {
      throw new Error(ERROR_MESSAGES.CAMION_ESTADO_INVALID);
    }
    return estado;
  }

  static validateCreateCamion(camionData) {
    const errors = [];
    let validatedData = {};

    try {
      validatedData.id = this.validateId(camionData.id);
    } catch (error) {
      errors.push(error.message);
    }

    try {
      validatedData.placa = this.validatePlaca(camionData.placa);
    } catch (error) {
      errors.push(error.message);
    }

    try {
      validatedData.modelo = this.validateModelo(camionData.modelo);
    } catch (error) {
      errors.push(error.message);
    }

    try {
      validatedData.capacidad = this.validateCapacidad(camionData.capacidad);
    } catch (error) {
      errors.push(error.message);
    }

    try {
      validatedData.year = this.validateYear(camionData.year);
    } catch (error) {
      errors.push(error.message);
    }

    try {
      validatedData.estado = this.validateEstado(camionData.estado);
    } catch (error) {
      errors.push(error.message);
    }

    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(", ")}`);
    }

    return validatedData;
  }

  static validateUpdateCamion(updateData) {
    const validatedUpdates = {};
    const errors = [];

    if (updateData.placa !== undefined) {
      try {
        validatedUpdates.placa = this.validatePlaca(updateData.placa);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (updateData.modelo !== undefined) {
      try {
        validatedUpdates.modelo = this.validateModelo(updateData.modelo);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (updateData.capacidad !== undefined) {
      try {
        validatedUpdates.capacidad = this.validateCapacidad(
          updateData.capacidad,
        );
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (updateData.year !== undefined) {
      try {
        validatedUpdates.year = this.validateYear(updateData.year);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (updateData.estado !== undefined) {
      try {
        validatedUpdates.estado = this.validateEstado(updateData.estado);
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Errores de validación: ${errors.join(", ")}`);
    }

    if (Object.keys(validatedUpdates).length === 0) {
      throw new Error("No hay campos válidos para actualizar");
    }

    return validatedUpdates;
  }

  static validateHttpMethod(event, expectedMethod) {
    if (event.httpMethod !== expectedMethod) {
      throw new Error(
        `${ERROR_MESSAGES.METHOD_NOT_ALLOWED}. Se esperaba ${expectedMethod}, se recibió ${event.httpMethod}`,
      );
    }
  }

  static validateRequestBody(body) {
    if (!body) {
      throw new Error(ERROR_MESSAGES.INVALID_REQUEST_BODY);
    }

    try {
      return JSON.parse(body);
    } catch (error) {
      throw new Error(
        `${ERROR_MESSAGES.INVALID_REQUEST_BODY}: ${error.message}`,
      );
    }
  }
}
