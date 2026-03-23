export class Camion {
  constructor(
    id,
    placa,
    modelo,
    capacidad,
    year,
    estado = "ACTIVO",
    createdAt = new Date().toISOString(),
  ) {
    this.id = id;
    this.placa = placa;
    this.modelo = modelo;
    this.capacidad = capacidad;
    this.year = year;
    this.estado = estado;
    this.createdAt = createdAt;
    this.updatedAt = createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      placa: this.placa,
      modelo: this.modelo,
      capacidad: this.capacidad,
      year: this.year,
      estado: this.estado,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromDatabase(item) {
    if (!item) return null;
    return new Camion(
      item.id,
      item.placa,
      item.modelo,
      item.capacidad,
      item.year,
      item.estado,
      item.createdAt,
    );
  }

  static fromDatabaseList(items) {
    if (!items || !Array.isArray(items)) return [];
    return items.map((item) => this.fromDatabase(item));
  }
}
