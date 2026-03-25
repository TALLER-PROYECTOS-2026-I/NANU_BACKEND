CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(120) NOT NULL,
    rol VARCHAR(50) DEFAULT 'admin',
    estado VARCHAR(20) DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conductores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    dni VARCHAR(15),
    licencia VARCHAR(30),
    telefono VARCHAR(20),
    estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE camiones (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(20) NOT NULL UNIQUE,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE contratos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    empresa VARCHAR(120) NOT NULL,
    tipo_servicio VARCHAR(30) NOT NULL,
    tarifa NUMERIC(10,2) NOT NULL,
    moneda VARCHAR(10) DEFAULT 'PEN',
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(20) DEFAULT 'activo',
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE contrato_camion (
    id SERIAL PRIMARY KEY,
    contrato_id INT NOT NULL,
    camion_id INT NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_contrato
        FOREIGN KEY (contrato_id) REFERENCES contratos(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_camion
        FOREIGN KEY (camion_id) REFERENCES camiones(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_contrato_camion UNIQUE (contrato_id, camion_id)
);

CREATE TABLE jornadas (
    id SERIAL PRIMARY KEY,
    conductor_id INT NOT NULL,
    camion_id INT NOT NULL,
    contrato_id INT NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP,
    observacion TEXT,
    estado VARCHAR(20) DEFAULT 'iniciada',
    CONSTRAINT fk_jornada_conductor
        FOREIGN KEY (conductor_id) REFERENCES conductores(id),
    CONSTRAINT fk_jornada_camion
        FOREIGN KEY (camion_id) REFERENCES camiones(id),
    CONSTRAINT fk_jornada_contrato
        FOREIGN KEY (contrato_id) REFERENCES contratos(id)
);

CREATE TABLE ubicaciones_gps (
    id SERIAL PRIMARY KEY,
    camion_id INT NOT NULL,
    latitud NUMERIC(10,6) NOT NULL,
    longitud NUMERIC(10,6) NOT NULL,
    velocidad NUMERIC(6,2),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_gps_camion
        FOREIGN KEY (camion_id) REFERENCES camiones(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS historial_contratos (
    id SERIAL PRIMARY KEY,
    contrato_id INT,
    accion VARCHAR(20) NOT NULL,
    datos_anteriores JSONB,
    datos_nuevos JSONB,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);