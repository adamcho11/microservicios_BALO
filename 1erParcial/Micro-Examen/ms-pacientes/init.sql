CREATE DATABASE IF NOT EXISTS bd_pacientes;
use bd_pacientes;

CREATE TABLE IF NOT EXISTS pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ci VARCHAR(20) NOT NULL UNIQUE,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  seguro VARCHAR(50) NOT NULL
);

INSERT INTO pacientes (ci, nombre, apellido, fecha_nacimiento, telefono, seguro) VALUES
('1001', 'Juan', 'Perez', '1990-05-12', '71000001', 'Nacional'),
('1002', 'Maria', 'Gomez', '1985-08-22', '71000002', 'Privado'),
('1003', 'Carlos', 'Lopez', '2000-01-15', '71000003', 'Ninguno'),
('1004', 'Lucia', 'Flores', '1995-11-30', '71000004', 'Nacional'),
('1005', 'Pedro', 'Mamani', '1992-03-05', '71000005', 'Privado');