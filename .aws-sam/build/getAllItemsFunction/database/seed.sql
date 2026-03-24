INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES
('Administrador', 'admin@nanutech.com', '123456', 'admin', 'activo'),
('Operador', 'operador@nanutech.com', '123456', 'operador', 'activo');

INSERT INTO conductores (nombre, dni, licencia, telefono, estado) VALUES
('Carlos Mendoza', '12345678', 'A3C-001', '999111222', 'activo'),
('Luis Ramirez', '23456789', 'A3C-002', '999222333', 'activo'),
('Pedro Gonzales', '34567890', 'A3C-003', '999333444', 'activo');

INSERT INTO camiones (placa, marca, modelo, estado) VALUES
('ABC123', 'Volvo', 'FH16', 'activo'),
('DEF456', 'Scania', 'R450', 'activo'),
('GHI789', 'Volvo', 'FMX', 'mantenimiento');

INSERT INTO contratos (codigo, empresa, tipo_servicio, tarifa, moneda, fecha_inicio, fecha_fin, estado, descripcion) VALUES
('CTR-2026-001', 'Minera del Sur SAC', 'Por tonelada', 25.00, 'PEN', '2026-01-01', '2026-12-31', 'activo', 'Transporte de mineral de mina a puerto'),
('CTR-2026-002', 'Constructora Lima Norte', 'Por hora', 80.00, 'PEN', '2026-01-15', '2026-06-30', 'activo', 'Transporte de material de construcción'),
('CTR-2026-003', 'Distribuidora Express SAC', 'Por viaje', 150.00, 'PEN', '2026-02-01', '2026-11-30', 'activo', 'Distribución de productos a nivel nacional');

INSERT INTO contrato_camion (contrato_id, camion_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(3, 1);

INSERT INTO jornadas (conductor_id, camion_id, contrato_id, fecha_inicio, fecha_fin, observacion, estado) VALUES
(1, 1, 1, '2026-03-10 08:00:00', '2026-03-10 16:30:00', 'Ruta normal, sin incidencias', 'completada'),
(2, 2, 2, '2026-03-10 09:00:00', '2026-03-10 17:30:00', 'Entrega completada', 'completada'),
(3, 1, 3, '2026-03-11 07:30:00', NULL, 'Jornada en curso', 'iniciada');

INSERT INTO ubicaciones_gps (camion_id, latitud, longitud, velocidad) VALUES
(1, -16.409047, -71.537451, 55.20),
(2, -16.420000, -71.530000, 48.00),
(1, -16.415500, -71.535100, 52.30);