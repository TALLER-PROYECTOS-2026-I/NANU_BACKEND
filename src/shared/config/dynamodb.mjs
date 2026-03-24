import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
export const ddbDocClient = DynamoDBDocumentClient.from(client);

export const CAMION_TABLE = process.env.CAMION_TABLE;
