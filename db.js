const { DatabaseSync } = require('node:sqlite');
const path = require('path');

// Abre (o crea, si no existe) el archivo de la base de datos
const db = new DatabaseSync(path.join(__dirname, 'galeria.db'));

// Crea la tabla la primera vez; si ya existe, no hace nada
db.exec(`
  CREATE TABLE IF NOT EXISTS dibujos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo      TEXT NOT NULL,
    descripcion TEXT NOT NULL DEFAULT '',
    archivo     TEXT NOT NULL,
    fecha       TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const insertar = db.prepare(
  'INSERT INTO dibujos (titulo, descripcion, archivo) VALUES (?, ?, ?)'
);
const listar = db.prepare('SELECT * FROM dibujos ORDER BY id DESC');

function guardarDibujo(titulo, descripcion, archivo) {
  insertar.run(titulo, descripcion, archivo);
}

function obtenerDibujos() {
  return listar.all();
}

module.exports = { guardarDibujo, obtenerDibujos };
