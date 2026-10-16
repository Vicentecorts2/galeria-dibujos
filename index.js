const express = require('express');
const multer = require('multer');
const path = require('path');
const { guardarDibujo, obtenerDibujos } = require('./db');

const app = express();
const PORT = 3000;

// Dónde y con qué nombre guarda Multer cada imagen
const storage = multer.diskStorage({
  destination: 'images/',
  filename: (req, file, cb) => {
    const unico = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unico + path.extname(file.originalname).toLowerCase());
  },
});

// Solo acepta imágenes de hasta 5 MB
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'imagen'));
    }
  },
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.render('index', { titulo: 'Mi galería de dibujos', dibujos: obtenerDibujos() });
});

app.post('/subir', upload.single('imagen'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Tienes que elegir una imagen');
  }

  guardarDibujo(req.body.titulo, req.body.descripcion || '', req.file.filename);
  res.redirect('/');
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('Error al subir:', err.code);
    return res.status(400).send('Error al subir el archivo: solo imágenes de hasta 5 MB');
  }
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`, err);
  res.status(500).send('Error interno del servidor');
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
