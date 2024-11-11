const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

// Configuración de la aplicación
const app = express();
const port = process.env.PORT || 3000; // Usa el puerto proporcionado por el entorno si está disponible

// Middleware para manejar JSON
app.use(bodyParser.json());

// Conexión a la base de datos SQLite
const dbPath = path.join(__dirname, 'asistencias.db'); // Establece la ruta adecuada para la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite.');
    }
});

// Crear tabla de asistencias si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS asistencias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        estado TEXT NOT NULL,
        fecha TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.error('Error al crear la tabla de asistencias:', err.message);
    } else {
        console.log('Tabla de asistencias asegurada.');
    }
});

// Ruta para guardar asistencia
app.post('/registrar', (req, res) => {
    const { nombre, estado, fecha } = req.body;

    if (!nombre || !estado || !fecha) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = `INSERT INTO asistencias (nombre, estado, fecha) VALUES (?, ?, ?)`;
    db.run(query, [nombre, estado, fecha], function (err) {
        if (err) {
            console.error('Error al guardar la asistencia:', err.message);
            return res.status(500).json({ error: 'Error al guardar la asistencia' });
        }
        res.status(200).json({ message: 'Asistencia registrada exitosamente', id: this.lastID });
    });
});

// Ruta para obtener todas las asistencias
app.get('/asistencias', (req, res) => {
    const query = `SELECT * FROM asistencias`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error al obtener las asistencias:', err.message);
            return res.status(500).json({ error: 'Error al obtener las asistencias' });
        }
        res.status(200).json(rows);
    });
});



app.delete('/limpiar-registros', (req, res) => {
    const query = `DELETE FROM asistencias`;

    db.run(query, function (err) {
        if (err) {
            console.error('Error al limpiar los registros:', err.message);
            return res.status(500).json({ error: 'Error al limpiar los registros' });
        }
        res.status(200).json({ message: 'Todos los registros han sido eliminados' });
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
