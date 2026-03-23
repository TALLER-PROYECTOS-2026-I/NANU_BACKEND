import { ScanCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient, CAMION_TABLE } from "../../shared/config/dynamodb.mjs";

export class CamionRepository {
  async getAll() {
    const params = {
      TableName: CAMION_TABLE,
    };

    try {
      const data = await ddbDocClient.send(new ScanCommand(params));
      return data.Items || [];
    } catch (error) {
      console.error("Error en getAll repository:", error);
      throw new Error(`Error al obtener camiones: ${error.message}`);
    }
  }

  async getById(id) {
    const params = {
      TableName: CAMION_TABLE,
      Key: { id },
    };

    try {
      const data = await ddbDocClient.send(new GetCommand(params));
      return data.Item || null;
    } catch (error) {
      console.error("Error en getById repository:", error);
      throw new Error(`Error al obtener camión con id ${id}: ${error.message}`);
    }
  }

  async exists(id) {
    try {
      const item = await this.getById(id);
      return item !== null;
    } catch (error) {
      console.error("Error en exists repository:", error);
      return false;
    }
  }

  async getByPlaca(placa) {
    const params = {
      TableName: CAMION_TABLE,
      FilterExpression: "placa = :placa",
      ExpressionAttributeValues: {
        ":placa": placa,
      },
    };

    try {
      const data = await ddbDocClient.send(new ScanCommand(params));
      return data.Items?.[0] || null;
    } catch (error) {
      console.error("Error en getByPlaca repository:", error);
      throw new Error(`Error al obtener camión por placa: ${error.message}`);
    }
  }
}
